/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("admin_users");
  const record = new Record(collection);
  record.set("email", "newadmin2@example.com");
  record.setPassword("SecurePass123");
  record.set("name", "Admin User");
  record.set("role", "admin");
  record.set("verified", true);
  record.set("status", "active");
  try {
    return app.save(record);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
      return;
    }
    throw e;
  }
}, (app) => {
  try {
    const record = app.findFirstRecordByData("admin_users", "email", "newadmin2@example.com");
    app.delete(record);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Auth record not found, skipping rollback");
      return;
    }
    throw e;
  }
})