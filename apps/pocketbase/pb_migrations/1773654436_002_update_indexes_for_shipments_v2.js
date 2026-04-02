/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("shipments_v2");
  collection.indexes.push("CREATE UNIQUE INDEX idx_shipments_v2_tracking_number ON shipments_v2 (tracking_number)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("shipments_v2");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_shipments_v2_tracking_number"));
  return app.save(collection);
})