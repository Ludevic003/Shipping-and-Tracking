/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("shipments");
  collection.indexes.push("CREATE UNIQUE INDEX idx_shipments_bl_number ON shipments (bl_number)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("shipments");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_shipments_bl_number"));
  return app.save(collection);
})