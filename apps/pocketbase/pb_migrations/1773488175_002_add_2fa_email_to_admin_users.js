/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("admin_users");

  const existing = collection.fields.getByName("2fa_email");
  if (existing) {
    if (existing.type === "email") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("2fa_email"); // exists with wrong type, remove first
  }

  collection.fields.add(new EmailField({
    name: "2fa_email",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("admin_users");
  collection.fields.removeByName("2fa_email");
  return app.save(collection);
})