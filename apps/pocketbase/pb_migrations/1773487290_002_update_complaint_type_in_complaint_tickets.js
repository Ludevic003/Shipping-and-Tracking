/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("complaint_tickets");
  const field = collection.fields.getByName("complaint_type");
  field.values = ["Damage", "Delay", "Lost Package", "General", "Service", "Billing", "Other"];
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("complaint_tickets");
  const field = collection.fields.getByName("complaint_type");
  field.values = ["Damage", "Delay", "Lost Package", "Other"];
  return app.save(collection);
})