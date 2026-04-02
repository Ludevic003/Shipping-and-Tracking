/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("receiver_details");

  const existing = collection.fields.getByName("receiver_postal_code");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("receiver_postal_code"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "receiver_postal_code"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("receiver_details");
  collection.fields.removeByName("receiver_postal_code");
  return app.save(collection);
})