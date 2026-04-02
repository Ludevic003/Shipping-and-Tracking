/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const sender_detailsCollection = app.findCollectionByNameOrId("sender_details");
  const collection = app.findCollectionByNameOrId("shipments");

  const existing = collection.fields.getByName("sender_id");
  if (existing) {
    if (existing.type === "relation") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("sender_id"); // exists with wrong type, remove first
  }

  collection.fields.add(new RelationField({
    name: "sender_id",
    required: true,
    collectionId: sender_detailsCollection.id
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("shipments");
  collection.fields.removeByName("sender_id");
  return app.save(collection);
})