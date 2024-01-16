if (typeof browser == "undefined") {
  globalThis.browser = chrome
}

class TrelloGateway {
  static ENDPOINT = "https://api.trello.com/1";
  static API_KEY = "2379d540412e417f6f0696c1397f38a6";

  #storage;

  constructor(storage) {
    this.#storage = storage;
  }

  getCard(id) {
    return this.#request("get", `/cards/${id}`);
  }

  updateCard(id, data) {
    return this.#request("put", `/cards/${id}`, data);
  }

  async #request(method, path, data = null) {
    const url = this.constructor.ENDPOINT + path;
    const { trello: token } = await this.#storage.get("trello");

    const response = await fetch(url, {
      method,
      headers: {
        "Authorization": `OAuth oauth_consumer_key="${this.constructor.API_KEY}", oauth_token="${token}"`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: (data === null) ? null : JSON.stringify(data),
    });

    if (response.status === 401) {
      throw new Error('Invalid or expired trello token.');
    } else {
      return response.json();
    }
  }
}

class TogglGateway {
  static ENDPOINT = "https://api.track.toggl.com/api/v8";

  #storage;

  constructor(storage) {
    this.#storage = storage;
  }

  getWorkspaces() {
    return this.#request("get", "/workspaces");
  }

  getProjects(workspaceId) {
    return this.#request("get", `/workspaces/${workspaceId}/projects`);
  }

  getTasks(projectId) {
    return this.#request("get", `/projects/${projectId}/tasks`);
  }

  createTask(projectId, name) {
    return this.#request("post", "/tasks", {
      task: { name, pid: projectId },
    });
  }

  getCurrentTimeEntry() {
    return this.#request("get", "/time_entries/current");
  }

  startTimeEntry(taskId, description) {
    return this.#request("post", "/time_entries/start", {
      time_entry: { description, tid: taskId, created_with: "trektor" },
    });
  }

  async #request(method, path, data = null) {
    const url = this.constructor.ENDPOINT + path;
    const { toggl: token } = await this.#storage.get("toggl");

    const response = await fetch(url, {
      method,
      headers: {
        "Authorization": `Basic ${btoa(`${token}:api_token`)}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: (data === null) ? null : JSON.stringify(data),
    });

    if (response.status === 403) {
      throw new Error('Invalid toggl token.');
    } else {
      return response.json();
    }
  }
}

var trektor = {
  trelloGateway: new TrelloGateway(browser.storage.local),
  togglGateway: new TogglGateway(browser.storage.local),
};


browser.runtime.onMessage.addListener(async (msg) => {
  switch (msg.action) {
    case 'track':
      await track(...msg.args);
      return;
    case 'addTask':
      await addTask(...msg.args);
      return;
    default:
      throw new Error(`unknown action: ${msg.action}`);
  }
});

async function track(cardId) {
  const task = await addTask(cardId);
  const card = await trektor.trelloGateway.getCard(cardId);
  const cardName = stripStoryPointsAndTaskToken(card.name);
  const response = await trektor.togglGateway.startTimeEntry(task.id, cardName);
  return response.data;
}

async function addTask(cardId) {
  const card = await trektor.trelloGateway.getCard(cardId);

  const taskPrefixes = card.labels
    .map((label) => label.name.match(/(?<=#)[a-z0-9]+$/)?.[0])
    .filter((prefix) => prefix !== undefined);

  if (taskPrefixes.length === 0) {
    throw new Error('Card has no valid project labels.');
  }
  if (taskPrefixes.length > 1) {
    throw new Error('Card has multiple project labels.');
  }
  const taskPrefix = taskPrefixes[0];

  let taskName = card.name.match(/(?<=#)[A-Za-z0-9_-]+/)?.[0];

  if (taskName === undefined) {
    taskName = `${taskPrefix}_${card.idShort}`;

    await trektor.trelloGateway.updateCard(card.id, {
      name: `${card.name} #${taskName}`,
    });
  }

  const workspaces = await trektor.togglGateway.getWorkspaces();

  if (workspaces.length === 0) {
    throw new Error('Could not find any toggl workspaces.');
  }
  if (workspaces.length > 1) {
    throw new Error('Found multiple toggl workspaces. Not sure how to deal with that...');
  }
  const allProjects = await trektor.togglGateway.getProjects(workspaces[0].id);
  const projects = allProjects.filter((project) => project.name.endsWith(`(${taskPrefix})`));

  if (projects.length === 0) {
    throw new Error('Could not find any matching toggl project.');
  }
  if (projects.length > 1) {
    throw new Error('Found multiple matching toggl projects. Not sure how to deal with that...');
  }
  const tasks = await trektor.togglGateway.getTasks(projects[0].id);
  const task = tasks.find((task) => task.name === taskName);
  if (task !== undefined) return task;

  const response = await trektor.togglGateway.createTask(projects[0].id, taskName)
  return response.data;
}

function stripStoryPointsAndTaskToken(cardName) {
  return cardName
    .replace(/^(\s*\(\d+\))?\s*/, '') // story points, e.g. (3)
    .replace(/\s*#[a-z0-9_]+\s*$/, ''); // task token, e.g. #orga_5417
}
