/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("shipments");
  const field = collection.fields.getByName("estimated_delivery_date");
  field.required = true;
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("shipments");
  const field = collection.fields.getByName("estimated_delivery_date");
  field.required = true;
  return app.save(collection);
})