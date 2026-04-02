/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("sender_details");
  const field = collection.fields.getByName("sender_name");
  field.required = true;
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("sender_details");
  const field = collection.fields.getByName("sender_name");
  field.required = true;
  return app.save(collection);
})