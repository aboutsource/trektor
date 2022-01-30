/* eslint-disable no-undef */
/* eslint-disable no-alert */
/* eslint-disable max-classes-per-file */
class ChromeStorage {
  constructor() {
    this.storage = chrome.storage.local;
  }

  get(keys) {
    return new Promise((resolve) => {
      this.storage.get(keys, resolve);
    });
  }

  set(values) {
    return new Promise((resolve) => {
      this.storage.set(values, resolve);
    });
  }
}

class ChromeRuntime {
  constructor() {
    this.runtime = chrome.runtime;
  }

  sendMessage(msg) {
    return new Promise((resolve) => {
      this.runtime.sendMessage(msg, resolve);
    });
  }

  onMessage(callback) {
    this.runtime.onMessage.addListener((msg, sender, respond) => {
      callback(msg).then((response) => {
        respond(response);
      });
    });
  }
}

window.trektor = {
  storage: null,
  runtime: null,

  async fetchJSON(url, options = {}, errorMessage = 'auto') {
    // console.log(`[Trektor]: fetching ${url}`);
    return fetch(url.toString(), options).then((response) => {
      if (!response.ok) {
        const errorMsg = (errorMessage === 'auto') ? `Fehler ${response.status} beim Abrufen von ${url.host}: ${response.statusText}.\n\
       Bitte stelle sicher, dass ein gültiger API-Token angegeben ist.` : errorMessage;
        alert(errorMsg);
        return false;
      }
      return response.json();
    });
  },
};

if (window.chrome !== undefined) {
  window.trektor.storage = new ChromeStorage();
  window.trektor.runtime = new ChromeRuntime();
} else {
  window.trektor.storage = browser.storage.local;
  window.trektor.runtime = browser.runtime;
}
