import express from 'express';
import pb from '../utils/pocketbase.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.post('/status-update', async (req, res) => {
  const { shipmentId, newStatus } = req.body;

  // Input validation
  if (!shipmentId || !newStatus) {
    return res.status(400).json({ error: 'Missing required fields: shipmentId, newStatus' });
  }

  logger.info(`Updating shipment ${shipmentId} to status: ${newStatus}`);

  // Fetch shipment record
  const shipment = await pb.collection('shipments').getOne(shipmentId);

  // Fetch sender and receiver records
  const sender = await pb.collection('users').getOne(shipment.sender_id);
  const receiver = await pb.collection('users').getOne(shipment.receiver_id);

  const senderEmail = sender.email;
  const receiverEmail = receiver.email;

  logger.info(`Fetched sender email: ${senderEmail}, receiver email: ${receiverEmail}`);

  // Update shipment status
  const updatedShipment = await pb.collection('shipments').update(shipmentId, {
    status: newStatus,
  });

  logger.info(`Shipment ${shipmentId} status updated to: ${newStatus}`);

  // Send emails using MailerMessage
  const senderEmailRecord = await pb.collection('mailbox').create({
    to: senderEmail,
    subject: `Shipment Status Update - ${shipmentId}`,
    text: `Your shipment ${shipmentId} status has been updated to: ${newStatus}`,
    html: `<p>Your shipment <strong>${shipmentId}</strong> status has been updated to: <strong>${newStatus}</strong></p>`,
  });

  const receiverEmailRecord = await pb.collection('mailbox').create({
    to: receiverEmail,
    subject: `Shipment Status Update - ${shipmentId}`,
    text: `Shipment ${shipmentId} status has been updated to: ${newStatus}`,
    html: `<p>Shipment <strong>${shipmentId}</strong> status has been updated to: <strong>${newStatus}</strong></p>`,
  });

  logger.info(`Emails sent to sender (${senderEmail}) and receiver (${receiverEmail})`);

  res.json({
    success: true,
    message: 'Status updated and notifications sent',
  });
});

// PUT /shipments/:id/tracking - Update shipment tracking number
router.put('/:id/tracking', async (req, res) => {
  const { id } = req.params;
  const { trackingNumber } = req.body;

  // Input validation
  if (!trackingNumber) {
    return res.status(400).json({ error: 'Missing required field: trackingNumber' });
  }

  if (typeof trackingNumber !== 'string' || trackingNumber.trim().length < 5) {
    return res.status(400).json({ error: 'trackingNumber must be a string with minimum 5 characters' });
  }

  logger.info(`Updating tracking number for shipment ${id}`);

  // Fetch shipment to verify it exists - will throw 404 if not found
  const shipment = await pb.collection('shipments_v2').getOne(id);

  logger.info(`Found shipment ${id}, updating tracking number to: ${trackingNumber}`);

  // Update shipment with tracking number
  const updatedShipment = await pb.collection('shipments_v2').update(id, {
    tracking_number: trackingNumber.trim(),
  });

  logger.info(`Shipment ${id} tracking number updated successfully`);

  res.json({
    success: true,
    message: 'Tracking number updated successfully',
    shipment: updatedShipment,
  });
});

export default router;