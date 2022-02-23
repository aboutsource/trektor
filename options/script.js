document.querySelectorAll("input").forEach((field) => {
  field.addEventListener("input", (e) => {
    browser.storage.local.set({ [e.target.name]: e.target.value });
  });

  browser.storage.local.get(field.name).then(({ [field.name]: value }) => {
    field.value = (value === undefined) ? '' : value;
  });
});
