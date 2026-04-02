import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbase.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Helper to mask email for privacy in logs
const maskEmail = (email) => {
  if (!email) return 'MISSING';
  const parts = email.split('@');
  if (parts.length !== 2) return 'INVALID_FORMAT';
  const [local, domain] = parts;
  if (local.length <= 2) return `***@${domain}`;
  return `${local.substring(0, 2)}${'*'.repeat(local.length - 2)}@${domain}`;
};

// POST /auth/login - Authenticate user against PocketBase
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const maskedEmail = maskEmail(email);

  // Log incoming request with masked email
  logger.info(`[AUTH LOGIN] Incoming login attempt for email: ${maskedEmail}`);

  // Input validation - return 400 directly
  if (!email || !password) {
    logger.warn('[AUTH LOGIN] Missing email or password in request');
    return res.status(400).json({ error: 'Email and password required' });
  }

  logger.info(`[AUTH LOGIN] Attempting to authenticate user: ${maskedEmail}`);

  // Authenticate against PocketBase users collection
  // Using .catch() to log the error and re-throw it to the errorMiddleware, avoiding try/catch blocks
  const authRecord = await pb.collection('users').authWithPassword(email, password).catch(error => {
    logger.error(`[AUTH LOGIN] PocketBase authentication failed for ${maskedEmail}:`, {
      message: error.message,
      status: error.status,
      data: error.data
    });
    
    // Throw error so errorMiddleware catches it (do not return 500 manually)
    throw error;
  });

  // Log successful authentication
  logger.info(`[AUTH LOGIN] Authentication successful for user ID: ${authRecord.record.id}`);

  // Return success response with user data and token
  res.status(200).json({
    user: {
      id: authRecord.record.id,
      email: authRecord.record.email,
      name: authRecord.record.name || null,
    },
    token: authRecord.token,
  });
});

export default router;