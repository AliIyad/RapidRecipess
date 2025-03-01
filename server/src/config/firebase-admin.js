const admin = require("firebase-admin");
const dotenv = require("dotenv");

// Ensure environment variables are loaded
dotenv.config();

// Initialize Firebase Admin only if it hasn't been initialized
let adminApp;
try {
  adminApp = admin.app();
} catch (error) {
  const serviceAccount = {
    type: process.env.TYPE || "service_account",
    project_id: process.env.PROJECT_ID || "rapid-recipes-b162c",
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.replace(/\\n/g, "\n") : "",
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL
  };

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
