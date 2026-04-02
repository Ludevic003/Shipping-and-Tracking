/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("shipments");

  const existing = collection.fields.getByName("bl_number");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("bl_number"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "bl_number",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("shipments");
  collection.fields.removeByName("bl_number");
  return app.save(collection);
})