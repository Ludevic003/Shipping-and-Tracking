/// <reference path="../pb_data/types.d.ts" />
onRecordAfterUpdateSuccess((e) => {
  const payload = {
    id: e.record.id,
    response: e.record.get("status"),
    updated_at: e.record.get("updated")
  };

  try {
    $http.send({
      url: "https://8c57ed32-11d4-4c98-a4eb-1a1d6d5e03a0.app-preview.com/hcgi/api/email/complaint-response",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.log("Error sending complaint response notification:", err);
  }

  e.next();
}, "complaint_tickets");