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
  static ENDPOINT = "https://api.track.toggl.com/api/v9";

  #storage;

  constructor(storage) {
    this.#storage = storage;
  }

  getWorkspaces() {
    return this.#request("get", "/workspaces");
  }

  getProjects(workspaceId) {
    return this.#request("get", `/workspaces/${workspaceId}/projects`, {
      params: { active: true, per_page: 200 },
    });
  }

  getTasks(workspaceId, projectId) {
    return this.#request("get", `/workspaces/${workspaceId}/projects/${projectId}/tasks`);
  }

  createTask(workspaceId, projectId, name) {
    return this.#request("post", `/workspaces/${workspaceId}/projects/${projectId}/tasks`, {
      data: { name },
    });
  }

  startTimeEntry(workspaceId, projectId, taskId, description) {
    return this.#request("post", `/workspaces/${workspaceId}/time_entries`, {
      data: {
        description,
        start: (new Date()).toISOString(),
        duration: -1,
        workspace_id: workspaceId,
        project_id: projectId,
        task_id: taskId,
        created_with: "trektor",
      },
    });
  }

  async #request(method, path, conf = {}) {
    let url = this.constructor.ENDPOINT + path;

    if (conf.params) {
      url += `?${(new URLSearchParams(conf.params)).toString()}`;
    }
    const { toggl: token } = await this.#storage.get("toggl");

    const response = await fetch(url, {
      method,
      headers: {
        "Authorization": `Basic ${btoa(`${token}:api_token`)}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: (conf.data) ? JSON.stringify(conf.data) : null,
    });

    if (response.status === 403) {
      throw new Error('Invalid toggl token.');
    } else {
      return response.json();
    }
  }
}

const trektorBrowser = (typeof browser == "undefined") ? chrome : browser;

const trektor = {
  trelloGateway: new TrelloGateway(trektorBrowser.storage.local),
  togglGateway: new TogglGateway(trektorBrowser.storage.local),
  browser: trektorBrowser,
}
