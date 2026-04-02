/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const complaintType = e.record.get("complaint_type");
  const description = e.record.get("description");
  const shipmentId = e.record.get("shipment_id");
  const userId = e.record.get("user_id");

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d32f2f;">New Complaint Ticket Received</h2>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      
      <div style="background-color: #ffebee; padding: 15px; border-radius: 5px;">
        <p><strong>Complaint Type:</strong> <span style="color: #d32f2f; font-weight: bold;">${complaintType}</span></p>
        <p><strong>Shipment ID:</strong> ${shipmentId}</p>
        <p><strong>User ID:</strong> ${userId}</p>
      </div>
      
      <h3 style="color: #333; margin-top: 20px;">Description:</h3>
      <p style="line-height: 1.6; color: #555; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${description}</p>
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="font-size: 12px; color: #999;">Please review and respond to this complaint as soon as possible.</p>
    </div>
  `;

  const mailMessage = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: "support@usboxmail.com" }],
    subject: "New Complaint Ticket - " + complaintType,
    html: htmlContent
  });

  $app.newMailClient().send(mailMessage);
  e.next();
}, "complaint_tickets");