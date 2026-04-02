/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const receiver_detailsCollection = app.findCollectionByNameOrId("receiver_details");
  const collection = app.findCollectionByNameOrId("shipments");

  const existing = collection.fields.getByName("receiver_id");
  if (existing) {
    if (existing.type === "relation") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("receiver_id"); // exists with wrong type, remove first
  }

  collection.fields.add(new RelationField({
    name: "receiver_id",
    required: true,
    collectionId: receiver_detailsCollection.id
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("shipments");
  collection.fields.removeByName("receiver_id");
  return app.save(collection);
})