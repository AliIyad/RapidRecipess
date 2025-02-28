const admin = require("firebase-admin");
const dotenv = require("dotenv");

// Ensure environment variables are loaded
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  "TYPE",
  "PROJECT_ID",
  "PRIVATE_KEY_ID",
  "PRIVATE_KEY",
  "CLIENT_EMAIL",
  "CLIENT_ID",
  "AUTH_URI",
  "TOKEN_URI",
  "AUTH_PROVIDER_X509_CERT_URL",
  "CLIENT_X509_CERT_URL",
];

const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
}

// Create service account configuration
const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY
    ? process.env.PRIVATE_KEY.replace(/\\n/g, "\n")
    : "",
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
};

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
  throw error;
}

module.exports = admin;
