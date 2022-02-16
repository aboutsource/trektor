document.querySelectorAll("input").forEach((field) => {
  field.addEventListener("input", (e) => {
    trektor.storage.set({ [e.target.name]: e.target.value });
  });

  trektor.storage.get(field.name).then(({ [field.name]: value }) => {
    field.value = (value === undefined) ? '' : value;
  });
});
