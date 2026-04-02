/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("admin_users");

  const existing = collection.fields.getByName("last_login");
  if (existing) {
    if (existing.type === "date") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("last_login"); // exists with wrong type, remove first
  }

  collection.fields.add(new DateField({
    name: "last_login",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("admin_users");
  collection.fields.removeByName("last_login");
  return app.save(collection);
})