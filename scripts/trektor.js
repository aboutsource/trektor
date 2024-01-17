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

function getTrektor() {
  return {
    trelloGateway: new TrelloGateway(browser.storage.local),
    togglGateway: new TogglGateway(browser.storage.local),
  }
}