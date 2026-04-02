/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const product_detailsCollection = app.findCollectionByNameOrId("product_details");
  const collection = app.findCollectionByNameOrId("shipments");

  const existing = collection.fields.getByName("product_id");
  if (existing) {
    if (existing.type === "relation") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("product_id"); // exists with wrong type, remove first
  }

  collection.fields.add(new RelationField({
    name: "product_id",
    required: true,
    collectionId: product_detailsCollection.id
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("shipments");
  collection.fields.removeByName("product_id");
  return app.save(collection);
})