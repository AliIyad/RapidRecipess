const admin = require("firebase-admin");
const dotenv = require("dotenv");
const path = require('path');

// Ensure environment variables are loaded from the correct path
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Debug environment variables
console.log('Environment Variables Check:');
console.log('PRIVATE_KEY exists:', !!process.env.PRIVATE_KEY);
console.log('CLIENT_EMAIL exists:', !!process.env.CLIENT_EMAIL);
console.log('PROJECT_ID exists:', !!process.env.PROJECT_ID);

// Initialize Firebase Admin only if it hasn't been initialized
let adminApp;
try {
  adminApp = admin.app();
} catch (error) {
  // Process the private key
  let privateKey = process.env.PRIVATE_KEY || "";
  
  // Remove surrounding quotes and replace escaped newlines
  privateKey = privateKey
    .replace(/\\n/g, '\n')
    .replace(/^["']|["']$/g, '')
    .trim();

  const serviceAccount = {
    type: process.env.TYPE || "service_account",
    project_id: process.env.PROJECT_ID || "rapid-recipes-b162c",
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: privateKey,
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL
  };

  // Validate required fields
  const requiredFields = ['private_key', 'client_email', 'project_id'];
  const missingFields = requiredFields.filter(field => !serviceAccount[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required service account fields: ${missingFields.join(', ')}`);
  }

  try {
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin initialized successfully");
  } catch (initError) {
    console.error("Error initializing Firebase Admin:", initError);
    throw initError;
  }
}

module.exports = adminApp || admin;
