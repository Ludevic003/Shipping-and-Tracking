/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("shipments");
  const field = collection.fields.getByName("tracking_photos");
  field.maxSelect = 10;
  field.maxSize = 20971520;
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("shipments");
  const field = collection.fields.getByName("tracking_photos");
  field.maxSelect = 10;
  field.maxSize = 20971520;
  return app.save(collection);
})