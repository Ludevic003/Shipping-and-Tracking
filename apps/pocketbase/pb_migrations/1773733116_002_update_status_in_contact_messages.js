/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("contact_messages");
  const field = collection.fields.getByName("status");
  field.type = "select";
  field.values = ["new", "read", "resolved"];
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("contact_messages");
  const field = collection.fields.getByName("status");
  field.type = "text";
  return app.save(collection);
})