/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("product_details");
  const field = collection.fields.getByName("product_value");
  field.required = true;
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("product_details");
  const field = collection.fields.getByName("product_value");
  field.required = true;
  return app.save(collection);
})