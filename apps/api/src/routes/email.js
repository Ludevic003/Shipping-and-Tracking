import express from 'express';
import logger from '../utils/logger.js';
import {
  sendContactFormEmail,
  sendContactFormAutoResponse,
  sendShipmentCreatedEmail,
  sendShipmentStatusUpdateEmail,
  sendComplaintEmail,
  sendComplaintAutoResponse,
  sendComplaintResponseEmail,
} from '../utils/emailNotifications.js';

const router = express.Router();

const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL || 'support@usboxmail.com',
  process.env.CLIENT_EMAIL || 'sompongsomduree@gmail.com',
];

// POST /email/contact-form
router.post('/contact-form', async (req, res) => {
  const { full_name, email, office_location, subject, message, created_at } = req.body;

  // Input validation
  if (!full_name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields: full_name, email, subject, message' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  logger.info(`[EMAIL] Processing contact form submission from ${email}`);

  // Send admin notification to both admins
  await sendContactFormEmail(
    ADMIN_EMAILS,
    full_name,
    email,
    office_location,
    subject,
    message,
    created_at
  );

  // Send auto-response to client
  await sendContactFormAutoResponse(email, full_name);

  logger.info(`[EMAIL] Contact form emails sent successfully for ${email}`);

  return res.status(200).json({ success: true, message: 'Contact form submitted and confirmation sent' });
});

// POST /email/shipment-created
router.post('/shipment-created', async (req, res) => {
  const { shipment_id, tracking_number, origin, destination, status, created_at, client_email } = req.body;

  // Input validation
  if (!shipment_id || !tracking_number) {
    return res.status(400).json({ error: 'Missing required fields: shipment_id, tracking_number' });
  }

  if (!client_email) {
    return res.status(400).json({ error: 'Missing required field: client_email' });
  }

  logger.info(`[EMAIL] Processing shipment created notification for tracking ${tracking_number}`);

  // Send admin notification to both admins
  await sendShipmentCreatedEmail(
    ADMIN_EMAILS,
    tracking_number,
    origin,
    destination,
    status,
    created_at,
    'admin'
  );

  // Send client notification
  await sendShipmentCreatedEmail(
    [client_email],
    tracking_number,
    origin,
    destination,
    status,
    created_at,
    'client'
  );

  logger.info(`[EMAIL] Shipment created emails sent successfully for tracking ${tracking_number}`);

  return res.status(200).json({ success: true, message: 'Shipment notification emails sent' });
});

// POST /email/shipment-status
router.post('/shipment-status', async (req, res) => {
  const { shipment_id, tracking_number, old_status, new_status, updated_at, client_email } = req.body;

  // Input validation
  if (!shipment_id || !tracking_number || !new_status) {
    return res.status(400).json({ error: 'Missing required fields: shipment_id, tracking_number, new_status' });
  }

  if (!client_email) {
    return res.status(400).json({ error: 'Missing required field: client_email' });
  }

  logger.info(`[EMAIL] Processing shipment status update for tracking ${tracking_number}`);

  // Send admin notification to both admins
  await sendShipmentStatusUpdateEmail(
    ADMIN_EMAILS,
    tracking_number,
    old_status,
    new_status,
    updated_at,
    'admin'
  );

  // Send client notification
  await sendShipmentStatusUpdateEmail(
    [client_email],
    tracking_number,
    old_status,
    new_status,
    updated_at,
    'client'
  );

  logger.info(`[EMAIL] Shipment status update emails sent successfully for tracking ${tracking_number}`);

  return res.status(200).json({ success: true, message: 'Shipment status update emails sent' });
});

// POST /email/complaint-filed
router.post('/complaint-filed', async (req, res) => {
  const { complaint_id, shipment_id, subject, description, created_at, client_email } = req.body;

  // Input validation
  if (!complaint_id || !description || !client_email) {
    return res.status(400).json({ error: 'Missing required fields: complaint_id, description, client_email' });
  }

  logger.info(`[EMAIL] Processing complaint filed notification for complaint ${complaint_id}`);

  // Send admin notification to both admins
  await sendComplaintEmail(
    ADMIN_EMAILS,
    complaint_id,
    shipment_id,
    subject,
    description,
    created_at,
    'admin'
  );

  // Send auto-response to client
  await sendComplaintAutoResponse(client_email, complaint_id);

  logger.info(`[EMAIL] Complaint filed emails sent successfully for complaint ${complaint_id}`);

  return res.status(200).json({ success: true, message: 'Complaint notification and confirmation sent' });
});

// POST /email/complaint-response
router.post('/complaint-response', async (req, res) => {
  const { complaint_id, response, updated_at, client_email } = req.body;

  // Input validation
  if (!complaint_id || !response || !client_email) {
    return res.status(400).json({ error: 'Missing required fields: complaint_id, response, client_email' });
  }

  logger.info(`[EMAIL] Processing complaint response for complaint ${complaint_id}`);

  // Send admin notification to both admins
  await sendComplaintResponseEmail(
    ADMIN_EMAILS,
    complaint_id,
    response,
    updated_at,
    'admin'
  );

  // Send response to client
  await sendComplaintResponseEmail(
    [client_email],
    complaint_id,
    response,
    updated_at,
    'client'
  );

  logger.info(`[EMAIL] Complaint response emails sent successfully for complaint ${complaint_id}`);

  return res.status(200).json({ success: true, message: 'Complaint response emails sent' });
});

export default router;