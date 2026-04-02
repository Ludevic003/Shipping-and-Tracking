/// <reference path="../pb_data/types.d.ts" />
// Admin authentication logging hook
// Fires when admin_users collection authenticates (login or token refresh)
// Logs auth events without interfering with session/token storage

onRecordAuthRequest((e) => {
  // Log authentication event
  const email = e.record.get("email");
  const timestamp = new Date().toISOString();
  
  console.log("[Admin Auth] Email: " + email + " | Timestamp: " + timestamp + " | Auth Method: " + e.authMethod);
  
  // Continue normal auth flow - CRITICAL: must call e.next()
  e.next();
}, "admin_users");