/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("receiver_details");
  const field = collection.fields.getByName("receiver_email");
  field.required = true;
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("receiver_details");
  const field = collection.fields.getByName("receiver_email");
  field.required = true;
  return app.save(collection);
})