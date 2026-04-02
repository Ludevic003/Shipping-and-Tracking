/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("complaint_tickets");

  const existing = collection.fields.getByName("preferred_resolution");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("preferred_resolution"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "preferred_resolution"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("complaint_tickets");
  collection.fields.removeByName("preferred_resolution");
  return app.save(collection);
})