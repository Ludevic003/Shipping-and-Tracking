/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("shipments");

  const existing = collection.fields.getByName("sender_city");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("sender_city"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "sender_city",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("shipments");
  collection.fields.removeByName("sender_city");
  return app.save(collection);
})