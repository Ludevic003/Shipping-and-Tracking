/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("bill_of_lading");
  collection.indexes.push("CREATE UNIQUE INDEX idx_bill_of_lading_bl_number ON bill_of_lading (bl_number)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("bill_of_lading");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_bill_of_lading_bl_number"));
  return app.save(collection);
})