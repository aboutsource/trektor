if (typeof browser == "undefined") {
  globalThis.browser = chrome
}

class BackgroundScript {

  static trektor;

  static init(trektor) {
    BackgroundScript.trektor = trektor

    browser.runtime.onMessage.addListener(async (msg) => {
      switch (msg.action) {
        case 'track':
          await BackgroundScript.track(...msg.args);
          return;
        case 'addTask':
          await BackgroundScript.addTask(...msg.args);
          return;
        default:
          throw new Error(`unknown action: ${msg.action}`);
      }
    });
  }

  static async track(cardId) {
    const task = await BackgroundScript.addTask(cardId);
    const card = await BackgroundScript.trektor.trelloGateway.getCard(cardId);
    const cardName = BackgroundScript.stripStoryPointsAndTaskToken(card.name);
    const response = await BackgroundScript.trektor.togglGateway.startTimeEntry(task.id, cardName);
    return response.data;
  }

  static async addTask(cardId) {
    const card = await BackgroundScript.trektor.trelloGateway.getCard(cardId);

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
      console.log(card.idBoard)
      taskName = `${taskPrefix}_${card.idShort}_${card.idBoard.substring(0, 3)}`;

      await BackgroundScript.trektor.trelloGateway.updateCard(card.id, {
        name: `${card.name} #${taskName}`,
      });
    }

    const workspaces = await BackgroundScript.trektor.togglGateway.getWorkspaces();

    if (workspaces.length === 0) {
      throw new Error('Could not find any toggl workspaces.');
    }
    if (workspaces.length > 1) {
      throw new Error('Found multiple toggl workspaces. Not sure how to deal with that...');
    }
    const allProjects = await BackgroundScript.trektor.togglGateway.getProjects(workspaces[0].id);
    const projects = allProjects.filter((project) => project.name.endsWith(`(${taskPrefix})`));

    if (projects.length === 0) {
      throw new Error('Could not find any matching toggl project.');
    }
    if (projects.length > 1) {
      throw new Error('Found multiple matching toggl projects. Not sure how to deal with that...');
    }
    const tasks = await BackgroundScript.trektor.togglGateway.getTasks(projects[0].id);
    const task = tasks.find((task) => task.name === taskName);
    if (task !== undefined) return task;

    const response = await BackgroundScript.trektor.togglGateway.createTask(projects[0].id, taskName)
    return response.data;
  }

  static stripStoryPointsAndTaskToken(cardName) {
    return cardName
      .replace(/^(\s*\(\d+\))?\s*/, '') // story points, e.g. (3)
      .replace(/\s*#[a-z0-9_]+\s*$/, ''); // task token, e.g. #orga_5417
  }
}
