/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const receiverId = e.record.get("receiver_id");
  const receiverRecord = $app.findRecordById("receiver_details", receiverId);
  
  const trackingNumber = e.record.get("tracking_number");
  const pickupLocation = e.record.get("pickup_location");
  const destinationLocation = e.record.get("destination_location");
  const estimatedDeliveryDate = e.record.get("estimated_delivery_date");
  
  const receiverName = receiverRecord.get("receiver_name");
  const receiverEmail = receiverRecord.get("receiver_email");
  const receiverContact = receiverRecord.get("receiver_contact");
  const receiverAddress = receiverRecord.get("receiver_address");
  
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: receiverEmail }],
    subject: "Incoming Shipment - Tracking #" + trackingNumber,
    html: "<h2>Shipment Notification</h2>" +
          "<p>Dear " + receiverName + ",</p>" +
          "<p>A shipment is on its way to you.</p>" +
          "<h3>Shipment Details:</h3>" +
          "<ul>" +
          "<li><strong>Tracking Number:</strong> " + trackingNumber + "</li>" +
          "<li><strong>Pickup Location:</strong> " + pickupLocation + "</li>" +
          "<li><strong>Destination Location:</strong> " + destinationLocation + "</li>" +
          "<li><strong>Estimated Delivery Date:</strong> " + estimatedDeliveryDate + "</li>" +
          "</ul>" +
          "<h3>Receiver Information:</h3>" +
          "<ul>" +
          "<li><strong>Name:</strong> " + receiverName + "</li>" +
          "<li><strong>Email:</strong> " + receiverEmail + "</li>" +
          "<li><strong>Contact:</strong> " + receiverContact + "</li>" +
          "<li><strong>Address:</strong> " + receiverAddress + "</li>" +
          "</ul>" +
          "<p>Please ensure someone is available to receive the package.</p>" +
          "<p>Thank you for using SwiftTrack!</p>"
  });
  $app.newMailClient().send(message);
  e.next();
}, "shipments");