import logger from './logger.js';

const sendEmailRequest = async (recipients, subject, htmlContent) => {
  // Ensure recipients is an array and remove duplicates
  const recipientArray = Array.isArray(recipients) ? recipients : [recipients];
  const uniqueRecipients = [...new Set(recipientArray)];

  logger.info(`[EMAIL UTILITY] Sending email to ${uniqueRecipients.length} recipient(s): ${uniqueRecipients.join(', ')}`);

  const port = process.env.PORT || 3001;

  // Send email to each recipient
  for (const recipient of uniqueRecipients) {
    const response = await fetch(`http://localhost:${port}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: recipient,
        subject,
        htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.error || `Failed to send email to ${recipient}`);
      error.status = response.status;
      logger.error(`[EMAIL UTILITY] Failed to send email to ${recipient}: ${error.message}`);
      throw error;
    }

    logger.info(`[EMAIL UTILITY] Email sent successfully to ${recipient}`);
  }

  return { success: true, recipientCount: uniqueRecipients.length };
};

export const sendContactFormEmail = async (
  recipientEmails,
  fullName,
  clientEmail,
  officeLocation,
  subject,
  message,
  createdAt
) => {
  logger.info(`[EMAIL UTILITY] Preparing contact form email for ${fullName}`);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-lg">
      <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">New Contact Form Submission</h2>
      <p><strong>From:</strong> ${fullName} (${clientEmail})</p>
      <p><strong>Office Location:</strong> ${officeLocation || 'Not specified'}</p>
      <p><strong>Date:</strong> ${createdAt ? new Date(createdAt).toLocaleString() : new Date().toLocaleString()}</p>
      <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 0.5rem;">
        <h3 style="margin-top: 0; color: #374151;">Subject: ${subject}</h3>
        <p style="white-space: pre-wrap; color: #4b5563; line-height: 1.6;">${message}</p>
      </div>
    </div>
  `;

  return sendEmailRequest(recipientEmails, `New Contact Form Submission from ${fullName}`, htmlContent);
};

export const sendContactFormAutoResponse = async (clientEmail, fullName) => {
  logger.info(`[EMAIL UTILITY] Preparing contact form auto-response for ${clientEmail}`);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-lg">
      <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">We Received Your Message</h2>
      <p>Hello ${fullName},</p>
      <p>Thank you for reaching out to us. We have successfully received your message and appreciate you taking the time to contact us.</p>
      <div style="margin-top: 20px; padding: 15px; background-color: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 0.5rem;">
        <h3 style="margin-top: 0; color: #1e40af;">What Happens Next?</h3>
        <p style="margin: 8px 0; color: #1e3a8a;">Our team will review your message and get back to you within <strong>24-48 hours</strong>. We're committed to providing you with a prompt and helpful response.</p>
      </div>
      <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border: 1px solid #e5e5e5; border-radius: 0.5rem;">
        <h3 style="margin-top: 0; color: #374151;">Support Contact Information</h3>
        <p style="margin: 8px 0; color: #4b5563;"><strong>Email:</strong> support@usboxmail.com</p>
        <p style="margin: 8px 0; color: #4b5563;"><strong>Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM (UTC)</p>
      </div>
      <p style="margin-top: 20px; color: #4b5563;">If you have any urgent matters, please feel free to reach out directly to our support team.</p>
      <p style="margin-top: 20px; color: #64748b; font-size: 0.9em;">Best regards,<br/>The Support Team</p>
    </div>
  `;

  return sendEmailRequest(clientEmail, 'We received your message', htmlContent);
};

export const sendShipmentCreatedEmail = async (
  recipientEmails,
  trackingNumber,
  origin,
  destination,
  status,
  createdAt,
  recipientType = 'admin'
) => {
  logger.info(`[EMAIL UTILITY] Preparing shipment created email for ${recipientType} (tracking: ${trackingNumber})`);

  let htmlContent;

  if (recipientType === 'admin') {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-lg">
        <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">New Shipment Created</h2>
        <p>A new shipment has been successfully created in the system.</p>
        <div style="margin-top: 20px; padding: 15px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.5rem;">
          <p style="margin: 8px 0;"><strong>Tracking Number:</strong> <span style="color: #2563eb; font-size: 1.1em; font-weight: bold;">${trackingNumber}</span></p>
          <p style="margin: 8px 0;"><strong>Origin:</strong> ${origin || 'N/A'}</p>
          <p style="margin: 8px 0;"><strong>Destination:</strong> ${destination || 'N/A'}</p>
          <p style="margin: 8px 0;"><strong>Status:</strong> ${status || 'Pending'}</p>
          <p style="margin: 8px 0;"><strong>Created At:</strong> ${createdAt ? new Date(createdAt).toLocaleString() : new Date().toLocaleString()}</p>
        </div>
        <p style="margin-top: 20px; color: #64748b; font-size: 0.9em;">You can track this shipment using the tracking number provided above.</p>
      </div>
    `;
  } else {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-lg">
        <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Your Shipment Has Been Created</h2>
        <p>Hello,</p>
        <p>Great news! Your shipment has been successfully created and is now in our system.</p>
        <div style="margin-top: 20px; padding: 15px; background-color: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 0.5rem;">
          <p style="margin: 8px 0;"><strong>Tracking Number:</strong> <span style="color: #2563eb; font-size: 1.2em; font-weight: bold;">${trackingNumber}</span></p>
          <p style="margin: 8px 0;"><strong>Origin:</strong> ${origin || 'N/A'}</p>
          <p style="margin: 8px 0;"><strong>Destination:</strong> ${destination || 'N/A'}</p>
          <p style="margin: 8px 0;"><strong>Status:</strong> ${status || 'Pending'}</p>
        </div>
        <p style="margin-top: 20px; color: #1e3a8a;">You can track your shipment status anytime using the tracking number above on our website.</p>
        <p style="margin-top: 20px; color: #4b5563;">If you have any questions about your shipment, please don't hesitate to contact our support team.</p>
        <p style="margin-top: 20px; color: #64748b; font-size: 0.9em;">Best regards,<br/>The Shipping Team</p>
      </div>
    `;
  }

  const subject = `New Shipment Created - ${trackingNumber}`;
  return sendEmailRequest(recipientEmails, subject, htmlContent);
};

export const sendShipmentStatusUpdateEmail = async (
  recipientEmails,
  trackingNumber,
  oldStatus,
  newStatus,
  updatedAt,
  recipientType = 'admin'
) => {
  logger.info(`[EMAIL UTILITY] Preparing shipment status update email for ${recipientType} (tracking: ${trackingNumber})`);

  let htmlContent;

  if (recipientType === 'admin') {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-lg">
        <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Shipment Status Updated</h2>
        <p>A shipment status has been updated in the system.</p>
        <div style="margin-top: 20px; padding: 15px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.5rem;">
          <p style="margin: 8px 0;"><strong>Tracking Number:</strong> <span style="color: #2563eb; font-weight: bold;">${trackingNumber}</span></p>
          <p style="margin: 8px 0;"><strong>Previous Status:</strong> <span style="color: #64748b;">${oldStatus || 'N/A'}</span></p>
          <p style="margin: 8px 0;"><strong>New Status:</strong> <span style="color: #059669; font-weight: bold;">${newStatus}</span></p>
          <p style="margin: 8px 0;"><strong>Updated At:</strong> ${updatedAt ? new Date(updatedAt).toLocaleString() : new Date().toLocaleString()}</p>
        </div>
      </div>
    `;
  } else {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-lg">
        <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Your Shipment Status Has Been Updated</h2>
        <p>Hello,</p>
        <p>We have an update on your shipment status.</p>
        <div style="margin-top: 20px; padding: 15px; background-color: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 0.5rem;">
          <p style="margin: 8px 0;"><strong>Tracking Number:</strong> <span style="color: #2563eb; font-weight: bold;">${trackingNumber}</span></p>
          <p style="margin: 8px 0;"><strong>Previous Status:</strong> <span style="color: #64748b;">${oldStatus || 'N/A'}</span></p>
          <p style="margin: 8px 0;"><strong>New Status:</strong> <span style="color: #059669; font-weight: bold;">${newStatus}</span></p>
          <p style="margin: 8px 0;"><strong>Updated At:</strong> ${updatedAt ? new Date(updatedAt).toLocaleString() : new Date().toLocaleString()}</p>
        </div>
        <p style="margin-top: 20px; color: #1e3a8a;">You can view more details about your shipment on our website using your tracking number.</p>
        <p style="margin-top: 20px; color: #4b5563;">If you have any questions, please contact our support team.</p>
        <p style="margin-top: 20px; color: #64748b; font-size: 0.9em;">Best regards,<br/>The Shipping Team</p>
      </div>
    `;
  }

  const subject = `Shipment Status Updated - ${trackingNumber}`;
  return sendEmailRequest(recipientEmails, subject, htmlContent);
};

export const sendComplaintEmail = async (
  recipientEmails,
  complaintId,
  shipmentId,
  subject,
  description,
  createdAt,
  recipientType = 'admin'
) => {
  logger.info(`[EMAIL UTILITY] Preparing complaint email for ${recipientType} (complaint: ${complaintId})`);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-lg">
      <h2 style="color: #dc2626; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">New Complaint Filed</h2>
      <p>A new complaint has been submitted by a client.</p>
      <div style="margin-top: 20px; padding: 15px; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 0.5rem;">
        <p style="margin: 8px 0;"><strong>Complaint ID:</strong> <span style="color: #dc2626; font-weight: bold;">${complaintId}</span></p>
        <p style="margin: 8px 0;"><strong>Related Shipment ID:</strong> ${shipmentId || 'N/A'}</p>
        <p style="margin: 8px 0;"><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <p style="margin: 8px 0;"><strong>Filed At:</strong> ${createdAt ? new Date(createdAt).toLocaleString() : new Date().toLocaleString()}</p>
        <h3 style="margin-top: 15px; color: #991b1b; font-size: 1em;">Description:</h3>
        <p style="white-space: pre-wrap; color: #7f1d1d; line-height: 1.6; margin-top: 5px;">${description}</p>
      </div>
    </div>
  `;

  const emailSubject = `New Complaint Filed - ${complaintId}`;
  return sendEmailRequest(recipientEmails, emailSubject, htmlContent);
};

export const sendComplaintAutoResponse = async (clientEmail, complaintId) => {
  logger.info(`[EMAIL UTILITY] Preparing complaint auto-response for ${clientEmail}`);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-lg">
      <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">We Received Your Complaint</h2>
      <p>Hello,</p>
      <p>Thank you for bringing this matter to our attention. We have successfully received your complaint and take it very seriously.</p>
      <div style="margin-top: 20px; padding: 15px; background-color: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 0.5rem;">
        <h3 style="margin-top: 0; color: #1e40af;">Complaint Reference</h3>
        <p style="margin: 8px 0; color: #1e3a8a;"><strong>Complaint ID:</strong> <span style="font-family: monospace; font-weight: bold;">${complaintId}</span></p>
        <p style="margin: 8px 0; color: #1e3a8a;">Please keep this reference number for your records.</p>
      </div>
      <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border: 1px solid #e5e5e5; border-radius: 0.5rem;">
        <h3 style="margin-top: 0; color: #374151;">What Happens Next?</h3>
        <p style="margin: 8px 0; color: #4b5563;">Our team will thoroughly investigate your complaint and work towards a resolution. We aim to respond within <strong>3-5 business days</strong>.</p>
        <p style="margin: 8px 0; color: #4b5563;">You will receive updates on the status of your complaint via email.</p>
      </div>
      <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border: 1px solid #e5e5e5; border-radius: 0.5rem;">
        <h3 style="margin-top: 0; color: #374151;">Support Contact Information</h3>
        <p style="margin: 8px 0; color: #4b5563;"><strong>Email:</strong> support@usboxmail.com</p>
        <p style="margin: 8px 0; color: #4b5563;"><strong>Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM (UTC)</p>
      </div>
      <p style="margin-top: 20px; color: #4b5563;">If you need to provide additional information or have urgent concerns, please reply to this email or contact our support team directly.</p>
      <p style="margin-top: 20px; color: #64748b; font-size: 0.9em;">Best regards,<br/>The Support Team</p>
    </div>
  `;

  return sendEmailRequest(clientEmail, 'We received your complaint', htmlContent);
};

export const sendComplaintResponseEmail = async (
  recipientEmails,
  complaintId,
  response,
  updatedAt,
  recipientType = 'admin'
) => {
  logger.info(`[EMAIL UTILITY] Preparing complaint response email for ${recipientType} (complaint: ${complaintId})`);

  let htmlContent;

  if (recipientType === 'admin') {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-lg">
        <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Complaint Response Sent</h2>
        <p>A response has been sent to the client regarding their complaint.</p>
        <div style="margin-top: 20px; padding: 15px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.5rem;">
          <p style="margin: 8px 0;"><strong>Complaint ID:</strong> <span style="color: #2563eb; font-weight: bold;">${complaintId}</span></p>
          <p style="margin: 8px 0;"><strong>Response Sent At:</strong> ${updatedAt ? new Date(updatedAt).toLocaleString() : new Date().toLocaleString()}</p>
          <h3 style="margin-top: 15px; color: #374151; font-size: 1em;">Response Details:</h3>
          <p style="white-space: pre-wrap; color: #4b5563; line-height: 1.6; margin-top: 5px;">${response}</p>
        </div>
      </div>
    `;
  } else {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-lg">
        <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Response to Your Complaint</h2>
        <p>Hello,</p>
        <p>Thank you for your patience. Our team has reviewed your complaint and we are pleased to provide you with the following response:</p>
        <div style="margin-top: 20px; padding: 15px; background-color: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 0.5rem;">
          <p style="margin: 8px 0;"><strong>Complaint ID:</strong> <span style="font-family: monospace; font-weight: bold;">${complaintId}</span></p>
          <h3 style="margin-top: 15px; color: #1e40af; font-size: 1em;">Our Response:</h3>
          <p style="white-space: pre-wrap; color: #1e3a8a; line-height: 1.6; margin-top: 5px;">${response}</p>
        </div>
        <p style="margin-top: 20px; color: #4b5563;">If you have any further questions or concerns regarding this response, please don't hesitate to contact us.</p>
        <p style="margin-top: 20px; color: #4b5563;"><strong>Email:</strong> support@usboxmail.com</p>
        <p style="margin-top: 20px; color: #64748b; font-size: 0.9em;">Best regards,<br/>The Support Team</p>
      </div>
    `;
  }

  const subject = `Response to Your Complaint - ${complaintId}`;
  return sendEmailRequest(recipientEmails, subject, htmlContent);
};