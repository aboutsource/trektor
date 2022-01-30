/* eslint-disable no-undef */
/* eslint-disable no-alert */

async function onClick() {
  const trelloApiKey = 'afadffe77f745496f80ebb4bf460c615';
  const tokens = await trektor.storage.get(['trello', 'toggl']);

  const idLong = window.location.pathname.split('/')[2];
  let url = new URL(`https://api.trello.com/1/cards/${idLong}`);
  const cardInfo = await trektor.fetchJSON(url, {
    headers: {
      Authorization: `OAuth oauth_consumer_key="${trelloApiKey}", oauth_token="${tokens.trello}"`,
      'Content-Type': 'application/json',
    },
  });

  if (cardInfo === false) {
    return false;
  }

  const {
    idShort,
  } = cardInfo;
  const labels = cardInfo.labels.filter((label) => label.name.includes('#'));
  if (labels.length > 1) {
    alert(`Diese Karte besitzt sowohl das Label ${labels[0].name} als auch das Label ${labels[1].name}`);
    return false;
  }
  if (labels.length === 0) {
    alert('Diese Karte besitzt kein unterstütztes Projekt Label.');
    return false;
  }
  const labelShort = labels[0].name.split('#').pop();

  if (!cardInfo.name.endsWith(`#${labelShort}_${idShort}`)) {
    url = new URL(`https://api.trello.com/1/cards/${idLong}`);

    const data = {
      name: `${cardInfo.name} #${labelShort}_${idShort}`,
    };
    trektor.fetchJSON(url, {
      method: 'PUT',
      headers: {
        Authorization: `OAuth oauth_consumer_key="${trelloApiKey}", oauth_token="${tokens.trello}"`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  url = new URL('https://api.track.toggl.com/api/v8/workspaces');
  const togglAuth = btoa(`${tokens.toggl}:api_token`);
  const workspaces = await trektor.fetchJSON(url, {
    headers: {
      Authorization: `Basic ${togglAuth}`,
      'Content-Type': 'application/json',
    },
  });
  if (workspaces === false) {
    return false;
  }
  const workspace = workspaces[0];

  url = new URL(`https://api.track.toggl.com/api/v8/workspaces/${workspace.id}/projects`);
  const projects = await trektor.fetchJSON(url, {
    headers: {
      Authorization: `Basic ${togglAuth}`,
      'Content-Type': 'application/json',
    },
  });
  if (projects === false) {
    return false;
  }
  const matchingProjects = projects.filter((project) => project.name.endsWith(`(${labelShort})`));
  if (matchingProjects.length === 0) {
    alert('Kein passendes Toggl-Projekt gefunden.');
    return false;
  }
  if (matchingProjects.length > 1) {
    alert(`Mehrere Toggl-Projekte, die mit "(${labelShort})" enden gefunden (${matchingProjects[0].name} und ${matchingProjects[1].name})`);
    return false;
  }
  const project = matchingProjects[0];
  url = new URL('https://api.track.toggl.com/api/v8/tasks');
  const data = {
    task: {
      name: `${labelShort}_${idShort}`,
      pid: project.id,
    },
  };
  const response = trektor.fetchJSON(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${togglAuth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }, `Toggl task ${labelShort}_${idShort} existiert bereits.`);
  return !!(response);
}

function addButton() {
  const sidebar = document.querySelector('.window-sidebar');
  const button = document.createElement('span');
  button.classList.add('button-link');
  button.addEventListener('click', onClick);
  sidebar.prepend(button);

  const buttonIcon = document.createElement('span');
  buttonIcon.classList.add('icon-sm', 'plugin-icon');
  buttonIcon.innerText = '+';
  button.append(buttonIcon);

  const buttonText = document.createElement('span');
  buttonText.innerText = 'Toggl Task';
  button.append(buttonText);

  sidebar.querySelector('.mod-no-top-margin').classList.remove('mod-no-top-margin');
  sidebar.querySelector('.js-sidebar-add-heading').classList.remove('mod-no-top-margin');
}

window.addEventListener('pushstate', () => {
  if (window.location.pathname.startsWith('/c/')) {
    addButton();
  }
});
