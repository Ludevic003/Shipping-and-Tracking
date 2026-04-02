/// <reference path="../pb_data/types.d.ts" />
onRecordAfterUpdateSuccess((e) => {
  const payload = {
    id: e.record.id,
    status: e.record.get("status"),
    updated_at: e.record.get("updated")
  };

  try {
    $http.send({
      url: "https://8c57ed32-11d4-4c98-a4eb-1a1d6d5e03a0.app-preview.com/hcgi/api/email/shipment-status",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.log("Error sending shipment status update notification:", err);
  }

  e.next();
}, "shipments_v2");