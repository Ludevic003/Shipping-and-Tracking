/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("shipments");
  collection.listRule = "@request.auth.id != '' && (sender_id.sender_email = @request.auth.email || receiver_id.receiver_email = @request.auth.email) || @request.auth.role = 'admin'";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("shipments");
  collection.listRule = "";
  return app.save(collection);
})