import express from 'express';
import pb from '../utils/pocketbase.js';
import logger from '../utils/logger.js';
import { sendContactFormEmail, sendContactFormAutoResponse } from '../utils/emailNotifications.js';

const router = express.Router();

const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL || 'support@usboxmail.com',
  process.env.CLIENT_EMAIL || 'sompongsomduree@gmail.com',
];

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Input validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields: name, email, subject, message' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  logger.info(`Creating contact submission from ${email}`);

  // Create record in PocketBase - let errors throw to errorMiddleware
  const record = await pb.collection('contact_submissions').create({
    name,
    email,
    subject,
    message,
  });

  logger.info(`Contact submission created with ID: ${record.id}`);

  // Send admin notification to both admins
  await sendContactFormEmail(
    ADMIN_EMAILS,
    name,
    email,
    null,
    subject,
    message,
    record.created
  );

  // Send auto-response to client
  await sendContactFormAutoResponse(email, name);

  logger.info(`Contact form emails sent successfully for ${email}`);

  res.json({
    success: true,
    message: 'Contact form submitted successfully',
  });
});

export default router;