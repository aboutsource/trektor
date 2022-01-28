class ChromeStorage {
  constructor() {
      this.storage = chrome.storage.local;
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
      callback(msg).then((response) => { respond(response) });
      return true;
    });
  }
}

window.trektor = {
  storage: null,
  runtime: null,

  fetchJSON(url, options = {}) {
    return this.runtime.sendMessage({
      action: 'fetchJSON',
      args: [url, options],
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
