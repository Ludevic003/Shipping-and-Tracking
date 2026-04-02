/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const trackingNumber = e.record.get("tracking_number");
  const senderName = e.record.get("sender_name");
  const receiverName = e.record.get("receiver_name");
  const receiverEmail = e.record.get("receiver_email");
  const estimatedDeliveryDate = e.record.get("estimated_delivery_date");
  const shipmentType = e.record.get("shipment_type");
  const recordId = e.record.id;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">New Shipment Created</h2>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Tracking Number:</strong> <span style="color: #0066cc; font-weight: bold; font-size: 16px;">${trackingNumber}</span></p>
        <p><strong>Sender Name:</strong> ${senderName}</p>
        <p><strong>Receiver Name:</strong> ${receiverName}</p>
        <p><strong>Receiver Email:</strong> ${receiverEmail}</p>
        <p><strong>Estimated Delivery Date:</strong> ${estimatedDeliveryDate}</p>
        <p><strong>Shipment Type:</strong> ${shipmentType}</p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
        <a href="http://localhost:8090/_/?/collections/shipments_v2/records/${recordId}" style="display: inline-block; background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Admin Dashboard</a>
      </div>
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="font-size: 12px; color: #999;">This is an automated notification from US Box Mail shipment system.</p>
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