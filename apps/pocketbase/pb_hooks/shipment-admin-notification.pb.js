/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const trackingNumber = e.record.get("tracking_number");
  const senderName = e.record.get("sender_name");
  const receiverName = e.record.get("receiver_name");
  const status = e.record.get("status");

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Shipment Created</h2>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
        <p><strong>Tracking Number:</strong> <span style="color: #0066cc; font-weight: bold;">${trackingNumber}</span></p>
        <p><strong>Sender:</strong> ${senderName}</p>
        <p><strong>Receiver:</strong> ${receiverName}</p>
        <p><strong>Status:</strong> <span style="background-color: #e3f2fd; padding: 5px 10px; border-radius: 3px;">${status}</span></p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="font-size: 12px; color: #999;">This is an automated notification from your shipment system.</p>
    </div>
  `;

  const mailMessage = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: "support@usboxmail.com" }],
    subject: "New Shipment Created - " + trackingNumber,
    html: htmlContent
  });

  $app.newMailClient().send(mailMessage);
  e.next();
}, "shipments_v2");