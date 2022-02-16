class ChromeStorage {
  constructor(storage) {
    this.storage = storage;
  }
  get(keys) {
    return new Promise((resolve) => {
      this.storage.get(keys, resolve);
    })
  }
  set(values) {
    return new Promise((resolve) => {
      this.storage.set(values, resolve);
    })
  }
}

class ChromeRuntime {
  constructor(runtime) {
    this.runtime = runtime;
  }

  sendMessage(msg) {
    return new Promise((resolve) => {
      this.runtime.sendMessage(msg, resolve);
    });
  }

  get onMessage() {
    const runtime = this.runtime;

    return {
      addListener(callback) {
        runtime.onMessage.addListener((msg, sender, respond) => {
          callback(msg)
            .then((response) => { respond(response) })
            .catch((error) => respond(error.message));
          return true;
        });
      },
    }
  }
}

class TrelloGateway {
  static ENDPOINT = "https://api.trello.com/1";
  static API_KEY = "afadffe77f745496f80ebb4bf460c615";

  constructor(storage) {
    this.storage = storage;
  }

  getCard(id) {
    return this.request("get", `/cards/${id}`);
  }

  updateCard(id, data) {
    return this.request("put", `/cards/${id}`, data);
  }

  async request(method, path, data = null) {
    const url = this.constructor.ENDPOINT + path;
    const { trello: token } = await this.storage.get("trello");

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

  constructor(storage) {
    this.storage = storage;
  }

  getWorkspaces() {
    return this.request("get", "/workspaces");
  }

  getProjects(workspaceId) {
    return this.request("get", `/workspaces/${workspaceId}/projects`);
  }

  getTasks(projectId) {
    return this.request("get", `/projects/${projectId}/tasks`);
  }

  createTask(projectId, name) {
    return this.request("post", "/tasks", {
      task: { name, pid: projectId },
    });
  }

  startTimeEntry(taskId) {
    return this.request("post", "/time_entries/start", {
      time_entry: { tid: taskId, created_with: "trektor" },
    });
  }

  async request(method, path, data = null) {
    const url = this.constructor.ENDPOINT + path;
    const { toggl: token } = await this.storage.get("toggl");

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

const trektor = {};

if (window.chrome !== undefined) {
  trektor.storage = new ChromeStorage(chrome.storage.local);
  trektor.runtime = new ChromeRuntime(chrome.runtime);
} else {
  trektor.storage = browser.storage.local;
  trektor.runtime = browser.runtime;
}

trektor.trelloGateway = new TrelloGateway(trektor.storage);
trektor.togglGateway = new TogglGateway(trektor.storage);

window.trektor = trektor;
