import 'dotenv/config';
import express from 'express';
import jwt from 'jsonwebtoken';
import pb from '../utils/pocketbase.js';
import logger from '../utils/logger.js';

const router = express.Router();

// GET /admin/verify - Verify admin session
router.get('/verify', async (req, res) => {
  // Extract token from cookies or Authorization header
  const token = req.cookies?.auth_token || 
               (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
  
  if (!token) {
    logger.warn('[ADMIN VERIFY] No authentication token provided');
    return res.status(401).json({ authenticated: false, error: 'No authentication token provided' });
  }

  if (!process.env.JWT_SECRET) {
    logger.error('[ADMIN VERIFY] JWT_SECRET is not set');
    throw new Error('Server configuration error');
  }

  // Verify token without try/catch (using Promise wrapper to catch jwt errors gracefully)
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) reject(err);
      else resolve(decodedToken);
    });
  }).catch(err => {
    logger.warn(`[ADMIN VERIFY] Token verification failed: ${err.message}`);
    return null;
  });

  if (!decoded) {
    return res.status(401).json({ authenticated: false, error: 'Invalid or expired token' });
  }
  
  // Verify user still exists in PocketBase
  const admin = await pb.collection('admin_users').getOne(decoded.id).catch(pbError => {
    if (pbError.status === 404) {
      logger.warn(`[ADMIN VERIFY] User not found in database: ${decoded.id}`);
      return null;
    }
    // Throw unexpected errors to be caught by errorMiddleware
    throw pbError;
  });
  
  if (!admin) {
    return res.status(401).json({ authenticated: false, error: 'User no longer exists' });
  }

  return res.status(200).json({
    authenticated: true,
    user: {
      id: admin.id,
      email: admin.email,
      role: admin.role
    }
  });
});

// POST /admin/login - Authenticate admin user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  logger.info(`[ADMIN LOGIN] Attempt for email: ${email || 'MISSING'}`);

  if (!email || !password) {
    logger.warn('[ADMIN LOGIN] Missing email or password');
    return res.status(400).json({ error: 'Email and password are required' });
  }

  logger.info(`[ADMIN LOGIN] Authenticating against PocketBase for: ${email}`);
  
  const authData = await pb.collection('admin_users').authWithPassword(email, password).catch(error => {
    if (error.status === 400 || error.message.includes('Failed to authenticate')) {
      logger.warn(`[ADMIN LOGIN] Invalid credentials for: ${email}`);
      return null;
    }
    throw error;
  });

  if (!authData) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  logger.info(`[ADMIN LOGIN] Authentication successful for: ${email}`);

  if (!process.env.JWT_SECRET) {
    logger.error('[ADMIN LOGIN] JWT_SECRET is not set');
    throw new Error('Server configuration error');
  }

  const token = jwt.sign(
    { id: authData.record.id, email: authData.record.email, role: authData.record.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('auth_token', token, {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return res.status(200).json({
    success: true,
    token,
    user: {
      id: authData.record.id,
      email: authData.record.email,
      role: authData.record.role
    }
  });
});

// POST /admin/create - Create a new admin user
router.post('/create', async (req, res) => {
  const { email, password, role = 'admin' } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing required fields: email, password' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  const existingAdmin = await pb.collection('admin_users').getFirstListItem(`email="${email}"`).catch(() => null);

  if (existingAdmin) {
    return res.status(400).json({ error: 'Admin user with this email already exists' });
  }

  const admin = await pb.collection('admin_users').create({
    email,
    password,
    passwordConfirm: password,
    role,
    verified: true
  }).catch(error => {
    logger.error(`[ADMIN CREATE] Error: ${error.message}`);
    throw error;
  });

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('auth_token', token, {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  logger.info(`Admin user created successfully: ${email}`);

  res.status(200).json({
    success: true,
    message: 'Admin user created successfully',
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      role: admin.role
    }
  });
});

export default router;