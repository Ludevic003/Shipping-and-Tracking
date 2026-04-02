/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("complaint_tickets");
  const field = collection.fields.getByName("shipment_id");
  field.required = false;
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("complaint_tickets");
  const field = collection.fields.getByName("shipment_id");
  field.required = true;
  return app.save(collection);
})