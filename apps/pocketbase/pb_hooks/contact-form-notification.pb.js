/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const payload = {
    full_name: e.record.get("full_name"),
    email: e.record.get("email"),
    office_location: e.record.get("office_location"),
    subject: e.record.get("subject"),
    message: e.record.get("message"),
    created_at: e.record.get("created")
  };

  try {
    $http.send({
      url: "https://8c57ed32-11d4-4c98-a4eb-1a1d6d5e03a0.app-preview.com/hcgi/api/email/contact-form",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.log("Error sending contact form notification:", err);
  }

  e.next();
}, "contact_messages");