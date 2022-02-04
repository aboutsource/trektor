const fields = document.querySelectorAll("input").forEach(async (field) => {
  field.addEventListener("input", (e) => {
    trektor.storage.set({[e.target.name]: e.target.value});
  });

  const { [field.name] : value } = await trektor.storage.get(field.name);
  field.value = (value === undefined) ? '' : value;
});
