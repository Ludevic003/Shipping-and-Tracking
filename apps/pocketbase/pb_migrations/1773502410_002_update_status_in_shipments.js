/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("shipments");
  const field = collection.fields.getByName("status");
  field.values = ["Pending", "Order has been picked up", "In Transit", "Out for Delivery", "On Hold", "In Custom Clearing", "Delivery Attempt", "Delivered"];
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("shipments");
  const field = collection.fields.getByName("status");
  field.values = ["Pending", "In Transit", "Out for Delivery", "Delivered"];
  return app.save(collection);
})