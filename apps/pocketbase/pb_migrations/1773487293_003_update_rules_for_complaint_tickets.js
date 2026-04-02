/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("complaint_tickets");
  collection.listRule = "user_email = @request.auth.email || @request.auth.role = 'admin'";
  collection.viewRule = "user_email = @request.auth.email || @request.auth.role = 'admin'";
  collection.createRule = "";
  collection.updateRule = "@request.auth.role = 'admin'";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("complaint_tickets");
  collection.listRule = "user_email = @request.auth.email || @request.auth.role = 'admin'";
  collection.viewRule = "user_email = @request.auth.email || @request.auth.role = 'admin'";
  collection.createRule = "";
  collection.updateRule = "@request.auth.role = 'admin'";
  return app.save(collection);
})