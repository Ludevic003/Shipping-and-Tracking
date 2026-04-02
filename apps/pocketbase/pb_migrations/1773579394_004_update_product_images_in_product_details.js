/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("product_details");
  const field = collection.fields.getByName("product_images");
  field.maxSelect = 5;
  field.maxSize = 20971520;
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("product_details");
  const field = collection.fields.getByName("product_images");
  field.maxSelect = 5;
  field.maxSize = 20971520;
  return app.save(collection);
})