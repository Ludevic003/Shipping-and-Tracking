/// <reference path="../pb_data/types.d.ts" />
onRecordAfterUpdateSuccess((e) => {
  const original = e.record.original();
  const oldStatus = original.get("status");
  const newStatus = e.record.get("status");
  
  // Only send if status actually changed
  if (oldStatus === newStatus) {
    e.next();
    return;
  }

  const userId = e.record.get("user_id");
  const complaintType = e.record.get("complaint_type");
  const description = e.record.get("description");
  const shipmentId = e.record.get("shipment_id");

  // Try to find the user's email from the users collection
  try {
    const user = $app.findRecordById("users", userId);
    const userEmail = user.get("email");

    if (userEmail) {
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Complaint Status Has Been Updated</h2>
          <p style="color: #666;">Dear Customer,</p>
          
          <p style="color: #666;">We have updated the status of your complaint. Here are the details:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Complaint Type:</strong> ${complaintType}</p>
            <p><strong>Shipment ID:</strong> ${shipmentId}</p>
            <p><strong>Previous Status:</strong> <span style="background-color: #fff3cd; padding: 5px 10px; border-radius: 3px;">${oldStatus}</span></p>
            <p><strong>New Status:</strong> <span style="background-color: #d4edda; padding: 5px 10px; border-radius: 3px;">${newStatus}</span></p>
          </div>
          
          <h3 style="color: #333;">Complaint Details:</h3>
          <p style="line-height: 1.6; color: #555;">${description}</p>
          
          <p style="color: #666; margin-top: 20px;">If you have any questions or concerns, please don't hesitate to contact us.</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">This is an automated notification from US Box Mail.</p>
        </div>
      `;

      const mailMessage = new MailerMessage({
        from: {
          address: $app.settings().meta.senderAddress,
          name: $app.settings().meta.senderName
        },
        to: [{ address: userEmail }],
        subject: "Your Complaint Status Updated - " + complaintType,
        html: htmlContent
      });

      $app.newMailClient().send(mailMessage);
    }
  } catch (err) {
    // User not found, skip email
  }

  e.next();
}, "complaint_tickets");