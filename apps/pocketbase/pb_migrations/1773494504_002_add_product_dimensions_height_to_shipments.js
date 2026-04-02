/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("shipments");

  const existing = collection.fields.getByName("product_dimensions_height");
  if (existing) {
    if (existing.type === "number") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("product_dimensions_height"); // exists with wrong type, remove first
  }

  collection.fields.add(new NumberField({
    name: "product_dimensions_height",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("shipments");
  collection.fields.removeByName("product_dimensions_height");
  return app.save(collection);
})