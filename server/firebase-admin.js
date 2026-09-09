const admin = require('firebase-admin'); // Firebase Admin SDK

// Initialize Firebase Admin with service account credentials
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL, // Realtime Database URL
});

const db = admin.database(); // Get a reference to the Realtime Database

module.exports = { admin, db }; // Export admin and database reference
