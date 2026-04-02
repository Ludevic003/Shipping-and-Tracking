/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("sender_details");

  const existing = collection.fields.getByName("sender_country");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("sender_country"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "sender_country"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("sender_details");
  collection.fields.removeByName("sender_country");
  return app.save(collection);
})