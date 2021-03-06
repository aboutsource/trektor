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
  const taskName = `${taskPrefix}_${card.idShort}`;
  const cardTaskName = card.name.match(/(?<=#)[a-z0-9]+_[0-9]+/)?.[0];

  if (cardTaskName === undefined) {
    await trektor.trelloGateway.updateCard(card.id, {
      name: `${card.name} #${taskName}`,
    });
  } else if (cardTaskName !== taskName) {
    throw new Error('Card name includes invalid tracking task.');
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
