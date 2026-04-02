/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("shipments");
  const field = collection.fields.getByName("bl_number");
  field.required = false;
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("shipments");
  const field = collection.fields.getByName("bl_number");
  field.required = false;
  return app.save(collection);
})