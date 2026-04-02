/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const senderId = e.record.get("sender_id");
  const senderRecord = $app.findRecordById("sender_details", senderId);
  
  const trackingNumber = e.record.get("tracking_number");
  const pickupLocation = e.record.get("pickup_location");
  const destinationLocation = e.record.get("destination_location");
  const estimatedDeliveryDate = e.record.get("estimated_delivery_date");
  
  const senderName = senderRecord.get("sender_name");
  const senderEmail = senderRecord.get("sender_email");
  const senderContact = senderRecord.get("sender_contact");
  const senderAddress = senderRecord.get("sender_address");
  
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: senderEmail }],
    subject: "Shipment Created - Tracking #" + trackingNumber,
    html: "<h2>Shipment Confirmation</h2>" +
          "<p>Dear " + senderName + ",</p>" +
          "<p>Your shipment has been created successfully.</p>" +
          "<h3>Shipment Details:</h3>" +
          "<ul>" +
          "<li><strong>Tracking Number:</strong> " + trackingNumber + "</li>" +
          "<li><strong>Pickup Location:</strong> " + pickupLocation + "</li>" +
          "<li><strong>Destination Location:</strong> " + destinationLocation + "</li>" +
          "<li><strong>Estimated Delivery Date:</strong> " + estimatedDeliveryDate + "</li>" +
          "</ul>" +
          "<h3>Sender Information:</h3>" +
          "<ul>" +
          "<li><strong>Name:</strong> " + senderName + "</li>" +
          "<li><strong>Email:</strong> " + senderEmail + "</li>" +
          "<li><strong>Contact:</strong> " + senderContact + "</li>" +
          "<li><strong>Address:</strong> " + senderAddress + "</li>" +
          "</ul>" +
          "<p>Thank you for using SwiftTrack!</p>"
  });
  $app.newMailClient().send(message);
  e.next();
}, "shipments");