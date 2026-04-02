/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("admin_users");

  const existing = collection.fields.getByName("account_locked");
  if (existing) {
    if (existing.type === "bool") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("account_locked"); // exists with wrong type, remove first
  }

  collection.fields.add(new BoolField({
    name: "account_locked",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("admin_users");
  collection.fields.removeByName("account_locked");
  return app.save(collection);
})