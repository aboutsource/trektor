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

if (window.chrome !== undefined) {
  window.trektorStorage = new ChromeStorage();
  window.trektorRuntime = new ChromeRuntime();
} else {
  window.trektorStorage = browser.storage.local;
  window.trektorRuntime = browser.runtime;
}
