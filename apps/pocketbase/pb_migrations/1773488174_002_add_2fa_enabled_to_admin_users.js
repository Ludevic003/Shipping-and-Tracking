/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("admin_users");

  const existing = collection.fields.getByName("2fa_enabled");
  if (existing) {
    if (existing.type === "bool") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("2fa_enabled"); // exists with wrong type, remove first
  }

  collection.fields.add(new BoolField({
    name: "2fa_enabled",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("admin_users");
  collection.fields.removeByName("2fa_enabled");
  return app.save(collection);
})