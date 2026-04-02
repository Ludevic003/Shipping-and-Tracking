/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const receiverEmail = e.record.get("receiver_email");
  const trackingNumber = e.record.get("tracking_number");
  const senderName = e.record.get("sender_name");
  const receiverName = e.record.get("receiver_name");
  const status = e.record.get("status");
  const pickupLocation = e.record.get("pickup_location");
  const destinationLocation = e.record.get("destination_location");

  if (!receiverEmail) {
    e.next();
    return;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Your Shipment Has Been Created</h2>
      <p style="color: #666;">Dear ${receiverName},</p>
      
      <p style="color: #666;">Your shipment has been registered in our system. Below are the details:</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Tracking Number:</strong> <span style="color: #0066cc; font-weight: bold; font-size: 16px;">${trackingNumber}</span></p>
        <p><strong>From:</strong> ${senderName}</p>
        <p><strong>To:</strong> ${receiverName}</p>
        <p><strong>Pickup Location:</strong> ${pickupLocation}</p>
        <p><strong>Destination:</strong> ${destinationLocation}</p>
        <p><strong>Current Status:</strong> <span style="background-color: #e3f2fd; padding: 5px 10px; border-radius: 3px;">${status}</span></p>
      </div>
      
      <p style="color: #666;">You can track your shipment using the tracking number above. We will notify you of any status updates.</p>
      
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
    subject: "Your Shipment is Ready - Tracking #" + trackingNumber,
    html: htmlContent
  });

  $app.newMailClient().send(mailMessage);
  e.next();
}, "shipments_v2");