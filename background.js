trektor.runtime.onMessage((msg) => {
  switch (msg.action) {
    case 'fetchJSON':
      return fetchJSON(...msg.args);
    default:
      return Promise.reject('unknown action');
  }
});

function fetchJSON(url, options = {}) {
  return fetch(url, options).then((response) => response.json());
}
