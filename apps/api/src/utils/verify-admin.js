import 'dotenv/config';
import PocketBase from 'pocketbase';
import logger from './logger.js';

const pb = new PocketBase(process.env.POCKETBASE_URL);

/**
 * Verify or create an admin user
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @param {string} role - Admin role (default: 'admin')
 * @param {string} status - Admin status (default: 'active')
 * @returns {Promise<Object>} Admin user record
 */
export async function verifyOrCreateAdmin(email, password, role = 'admin', status = 'active') {
  try {
    logger.info(`[VERIFY ADMIN] Checking if admin user exists: ${email}`);

    // Try to fetch existing admin user
    let admin;
    try {
      admin = await pb.collection('admin_users').getFirstListItem(`email="${email}"`);
      logger.info(`[VERIFY ADMIN] Admin user found: ${email} (ID: ${admin.id})`);
      logger.info(`[VERIFY ADMIN] Existing admin details - Role: ${admin.role}, Status: ${admin.status || 'N/A'}, Verified: ${admin.verified}`);
      return {
        success: true,
        action: 'existing',
        message: `Admin user already exists: ${email}`,
        admin: {
          id: admin.id,
          email: admin.email,
          role: admin.role,
          status: admin.status || 'N/A',
          verified: admin.verified,
        },
      };
    } catch (error) {
      if (error.status === 404) {
        logger.info(`[VERIFY ADMIN] Admin user not found: ${email} - Will create new user`);
      } else {
        throw error;
      }
    }

    // Admin doesn't exist, create new one
    logger.info(`[VERIFY ADMIN] Creating new admin user: ${email}`);
    logger.info(`[VERIFY ADMIN] Admin details - Email: ${email}, Role: ${role}, Status: ${status}`);

    const newAdmin = await pb.collection('admin_users').create({
      email,
      password,
      passwordConfirm: password,
      role,
      status,
      verified: true,
    });

    logger.info(`[VERIFY ADMIN] Admin user created successfully: ${email} (ID: ${newAdmin.id})`);
    logger.info(`[VERIFY ADMIN] New admin details - Role: ${newAdmin.role}, Status: ${newAdmin.status}, Verified: ${newAdmin.verified}`);

    return {
      success: true,
      action: 'created',
      message: `Admin user created successfully: ${email}`,
      admin: {
        id: newAdmin.id,
        email: newAdmin.email,
        role: newAdmin.role,
        status: newAdmin.status,
        verified: newAdmin.verified,
      },
    };
  } catch (error) {
    logger.error(`[VERIFY ADMIN] Error during verification/creation: ${error.message}`);
    throw error;
  }
}

/**
 * Verify admin user can authenticate
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise<Object>} Authentication result
 */
export async function verifyAdminAuth(email, password) {
  try {
    logger.info(`[VERIFY AUTH] Testing authentication for: ${email}`);

    const authData = await pb.collection('admin_users').authWithPassword(email, password);

    logger.info(`[VERIFY AUTH] Authentication successful for: ${email}`);
    logger.info(`[VERIFY AUTH] Auth token generated - Token length: ${authData.token.length} characters`);

    return {
      success: true,
      message: `Authentication successful for: ${email}`,
      auth: {
        id: authData.record.id,
        email: authData.record.email,
        role: authData.record.role,
        token: authData.token,
      },
    };
  } catch (error) {
    logger.error(`[VERIFY AUTH] Authentication failed for ${email}: ${error.message}`);
    throw error;
  }
}

/**
 * Run verification and creation
 */
async function main() {
  const email = 'newadmin2@example.com';
  const password = 'SecurePass123';
  const role = 'admin';
  const status = 'active';

  try {
    logger.info('========================================');
    logger.info('ADMIN USER VERIFICATION SCRIPT');
    logger.info('========================================');
    logger.info(`Target email: ${email}`);
    logger.info(`PocketBase URL: ${process.env.POCKETBASE_URL}`);
    logger.info('');

    // Step 1: Verify or create admin
    logger.info('[STEP 1] Verifying or creating admin user...');
    const verifyResult = await verifyOrCreateAdmin(email, password, role, status);
    logger.info(`Result: ${verifyResult.message}`);
    logger.info(`Action: ${verifyResult.action}`);
    logger.info('');

    // Step 2: Verify authentication
    logger.info('[STEP 2] Verifying admin authentication...');
    const authResult = await verifyAdminAuth(email, password);
    logger.info(`Result: ${authResult.message}`);
    logger.info(`Auth token generated: ${authResult.auth.token.substring(0, 20)}...`);
    logger.info('');

    // Final summary
    logger.info('========================================');
    logger.info('VERIFICATION COMPLETE');
    logger.info('========================================');
    logger.info(`✅ Admin user verified/created: ${email}`);
    logger.info(`✅ Authentication verified: ${email}`);
    logger.info(`✅ Admin ID: ${verifyResult.admin.id}`);
    logger.info(`✅ Admin Role: ${verifyResult.admin.role}`);
    logger.info(`✅ Admin Status: ${verifyResult.admin.status}`);
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

export default { verifyOrCreateAdmin, verifyAdminAuth };