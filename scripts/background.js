class BackgroundWorker {
  run() {
    trektor.browser.runtime.onMessage.addListener((msg, _, sendResponse) => {
      switch (msg.action) {
        case "track":
          this.track(...msg.args)
            .then(() => sendResponse(null))
            .catch((e) => sendResponse(e.message));
          break;
        case "addTask":
          this.addTask(...msg.args)
            .then(() => sendResponse(null))
            .catch((e) => sendResponse(e.message));
          break;
        default:
          throw new Error(`unknown action: ${msg.action}`);
      }
      return true;
    });
  }

  async track(cardId) {
    const task = await this.addTask(cardId);
    const card = await trektor.trelloGateway.getCard(cardId);
    const cardName = this.stripStoryPointsAndTaskToken(card.name);
    const response = await trektor.togglGateway.startTimeEntry(task.workspace_id, task.project_id, task.id, cardName);
    return response.data;
  }

  async addTask(cardId) {
    const card = await trektor.trelloGateway.getCard(cardId);

    const taskPrefixes = card.labels
      .map((label) => label.name.match(/(?<=#)[a-z0-9]+$/)?.[0])
      .filter((prefix) => prefix !== undefined);

    if (taskPrefixes.length === 0) {
      throw new Error("Card has no valid project labels.");
    }
    if (taskPrefixes.length > 1) {
      throw new Error("Card has multiple project labels.");
    }
    const taskPrefix = taskPrefixes[0];

    let taskName = card.name.match(/(?<=#)[A-Za-z0-9_-]+/)?.[0];

    if (taskName === undefined) {
      taskName = `${taskPrefix}_${card.idShort}_${card.shortLink}`;
      await trektor.trelloGateway.updateCard(card.id, {
        name: `${card.name} #${taskName}`,
      });
    }

    const workspaces = await trektor.togglGateway.getWorkspaces();

    if (workspaces.length === 0) {
      throw new Error("Could not find any toggl workspaces.");
    }
    if (workspaces.length > 1) {
      throw new Error("Found multiple toggl workspaces. Not sure how to deal with that...");
    }
    const allProjects = await trektor.togglGateway.getProjects(workspaces[0].id);
    const projects = allProjects.filter((project) => project.name.endsWith(`(${taskPrefix})`));

    if (projects.length === 0) {
      throw new Error("Could not find any matching toggl project.");
    }
    if (projects.length > 1) {
      throw new Error("Found multiple matching toggl projects. Not sure how to deal with that...");
    }
    const tasks = await trektor.togglGateway.getTasks(workspaces[0].id, projects[0].id);
    const task = tasks.find((task) => task.name === taskName);
    if (task !== undefined) return task;

    return trektor.togglGateway.createTask(workspaces[0].id, projects[0].id, taskName);
  }

  stripStoryPointsAndTaskToken(cardName) {
    return cardName
      .replace(/^(\s*\(\d+\))?\s*/, "") // story points, e.g. (3)
      .replace(/\s*#\w+\s*$/, ""); // task token, e.g. #orga_5417
  }
}
