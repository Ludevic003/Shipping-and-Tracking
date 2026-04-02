/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("admin_users");

  const existing = collection.fields.getByName("login_attempts");
  if (existing) {
    if (existing.type === "number") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("login_attempts"); // exists with wrong type, remove first
  }

  collection.fields.add(new NumberField({
    name: "login_attempts",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("admin_users");
  collection.fields.removeByName("login_attempts");
  return app.save(collection);
})