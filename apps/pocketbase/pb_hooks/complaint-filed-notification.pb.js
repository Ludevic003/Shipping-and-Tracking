/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const payload = {
    id: e.record.id,
    shipment_id: e.record.get("shipment_id"),
    subject: e.record.get("complaint_type"),
    description: e.record.get("description"),
    created_at: e.record.get("created")
  };

  try {
    $http.send({
      url: "https://8c57ed32-11d4-4c98-a4eb-1a1d6d5e03a0.app-preview.com/hcgi/api/email/complaint-filed",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.log("Error sending complaint filed notification:", err);
  }

  e.next();
}, "complaint_tickets");