import 'dotenv/config';
import PocketBase from 'pocketbase';
import logger from './logger.js';

const pb = new PocketBase(process.env.POCKETBASE_URL);

/**
 * Verify or create a test user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User name
 * @returns {Promise<Object>} User record
 */
export async function verifyOrCreateTestUser(email, password, name = 'Test User') {
  try {
    logger.info(`[VERIFY TEST USER] Checking if user exists: ${email}`);

    // Try to fetch existing user
    let user;
    try {
      user = await pb.collection('users').getFirstListItem(`email="${email}"`);
      logger.info(`[VERIFY TEST USER] User found: ${email} (ID: ${user.id})`);
      logger.info(`[VERIFY TEST USER] Existing user details - Name: ${user.name}, Email: ${user.email}`);
      return {
        success: true,
        action: 'existing',
        message: `User already exists: ${email}`,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      if (error.status === 404) {
        logger.info(`[VERIFY TEST USER] User not found: ${email} - Will create new user`);
      } else {
        throw error;
      }
    }

    // User doesn't exist, create new one
    logger.info(`[VERIFY TEST USER] Creating new user: ${email}`);
    logger.info(`[VERIFY TEST USER] User details - Email: ${email}, Name: ${name}`);

    const newUser = await pb.collection('users').create({
      email,
      password,
      passwordConfirm: password,
      name,
    });

    logger.info(`[VERIFY TEST USER] User created successfully: ${email} (ID: ${newUser.id})`);
    logger.info(`[VERIFY TEST USER] New user details - Name: ${newUser.name}, Email: ${newUser.email}`);

    return {
      success: true,
      action: 'created',
      message: `User created successfully: ${email}`,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    };
  } catch (error) {
    logger.error(`[VERIFY TEST USER] Error during verification/creation: ${error.message}`);
    throw error;
  }
}

/**
 * Verify user can authenticate
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Authentication result
 */
export async function verifyUserAuth(email, password) {
  try {
    logger.info(`[VERIFY USER AUTH] Testing authentication for: ${email}`);

    const authData = await pb.collection('users').authWithPassword(email, password);

    logger.info(`[VERIFY USER AUTH] Authentication successful for: ${email}`);
    logger.info(`[VERIFY USER AUTH] Auth token generated - Token length: ${authData.token.length} characters`);

    return {
      success: true,
      message: `Authentication successful for: ${email}`,
      auth: {
        id: authData.record.id,
        email: authData.record.email,
        name: authData.record.name,
        token: authData.token,
      },
    };
  } catch (error) {
    logger.error(`[VERIFY USER AUTH] Authentication failed for ${email}: ${error.message}`);
    throw error;
  }
}

/**
 * Run verification and creation
 */
async function main() {
  const email = 'client@example.com';
  const password = 'password123';
  const name = 'Test Client';

  try {
    logger.info('========================================');
    logger.info('TEST USER VERIFICATION SCRIPT');
    logger.info('========================================');
    logger.info(`Target email: ${email}`);
    logger.info(`PocketBase URL: ${process.env.POCKETBASE_URL}`);
    logger.info('');

    // Step 1: Verify or create test user
    logger.info('[STEP 1] Verifying or creating test user...');
    const verifyResult = await verifyOrCreateTestUser(email, password, name);
    logger.info(`Result: ${verifyResult.message}`);
    logger.info(`Action: ${verifyResult.action}`);
    logger.info('');

    // Step 2: Verify authentication
    logger.info('[STEP 2] Verifying user authentication...');
    const authResult = await verifyUserAuth(email, password);
    logger.info(`Result: ${authResult.message}`);
    logger.info(`Auth token generated: ${authResult.auth.token.substring(0, 20)}...`);
    logger.info('');

    // Final summary
    logger.info('========================================');
    logger.info('VERIFICATION COMPLETE');
    logger.info('========================================');
    logger.info(`✅ Test user verified/created: ${email}`);
    logger.info(`✅ Authentication verified: ${email}`);
    logger.info(`✅ User ID: ${verifyResult.user.id}`);
    logger.info(`✅ User Name: ${verifyResult.user.name}`);
    logger.info('');

    process.exit(0);
  } catch (error) {
    logger.error('========================================');
    logger.error('VERIFICATION FAILED');
    logger.error('========================================');
    logger.error(`Error: ${error.message}`);
    logger.error(`Stack: ${error.stack}`);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default { verifyOrCreateTestUser, verifyUserAuth };