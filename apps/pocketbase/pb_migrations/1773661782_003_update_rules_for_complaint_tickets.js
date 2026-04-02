/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("complaint_tickets");
  collection.listRule = "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')";
  collection.viewRule = "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')";
  collection.updateRule = "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')";
  collection.deleteRule = "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("complaint_tickets");
  collection.listRule = "@request.auth.id != '' && user_id = @request.auth.id || @request.auth.role = 'admin'";
  collection.viewRule = "@request.auth.id != '' && user_id = @request.auth.id || @request.auth.role = 'admin'";
  collection.updateRule = "@request.auth.id != '' && user_id = @request.auth.id || @request.auth.role = 'admin'";
  collection.deleteRule = "@request.auth.id != '' && user_id = @request.auth.id || @request.auth.role = 'admin'";
  return app.save(collection);
})