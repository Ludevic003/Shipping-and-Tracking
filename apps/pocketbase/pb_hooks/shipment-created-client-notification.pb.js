/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const receiverEmail = e.record.get("receiver_email");
  const trackingNumber = e.record.get("tracking_number");
  const senderName = e.record.get("sender_name");
  const estimatedDeliveryDate = e.record.get("estimated_delivery_date");
  const shipmentType = e.record.get("shipment_type");
  const recordId = e.record.id;

  if (!receiverEmail) {
    e.next();
    return;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">Your Shipment Has Been Created</h2>
      
      <p style="color: #666; font-size: 16px;">Dear Recipient,</p>
      
      <p style="color: #666;">Your shipment has been registered in our system. Below are the details:</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Tracking Number:</strong> <span style="color: #0066cc; font-weight: bold; font-size: 16px;">${trackingNumber}</span></p>
        <p><strong>From:</strong> ${senderName}</p>
        <p><strong>Estimated Delivery Date:</strong> ${estimatedDeliveryDate}</p>
        <p><strong>Shipment Type:</strong> ${shipmentType}</p>
      </div>
      
      <p style="color: #666;">You can track your shipment using the tracking number above. We will notify you of any status updates.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
        <a href="http://localhost:8090/track/${trackingNumber}" style="display: inline-block; background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Track Your Shipment</a>
      </div>
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="font-size: 12px; color: #999;">This is an automated notification from US Box Mail.</p>
    </div>
  `;

  const mailMessage = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: receiverEmail }],
    subject: "Your Shipment Has Been Created",
    html: htmlContent
  });

  $app.newMailClient().send(mailMessage);
  e.next();
}, "shipments_v2");