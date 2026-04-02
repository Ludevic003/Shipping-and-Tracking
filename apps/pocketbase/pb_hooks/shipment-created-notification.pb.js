/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const payload = {
    id: e.record.id,
    tracking_number: e.record.get("tracking_number"),
    origin: e.record.get("pickup_location"),
    destination: e.record.get("destination_location"),
    status: e.record.get("status"),
    created_at: e.record.get("created")
  };

  try {
    $http.send({
      url: "https://8c57ed32-11d4-4c98-a4eb-1a1d6d5e03a0.app-preview.com/hcgi/api/email/shipment-created",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.log("Error sending shipment created notification:", err);
  }

  e.next();
}, "shipments_v2");