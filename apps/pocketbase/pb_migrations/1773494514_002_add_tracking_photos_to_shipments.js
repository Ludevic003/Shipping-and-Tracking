/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("shipments");

  const existing = collection.fields.getByName("tracking_photos");
  if (existing) {
    if (existing.type === "file") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("tracking_photos"); // exists with wrong type, remove first
  }

  collection.fields.add(new FileField({
    name: "tracking_photos",
    required: false,
    maxSelect: 10,
    maxSize: 20971520
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("shipments");
  collection.fields.removeByName("tracking_photos");
  return app.save(collection);
})