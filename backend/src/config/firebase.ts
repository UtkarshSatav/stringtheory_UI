import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

// If running locally, you can pass the path to your service account key in the .env file
// e.g., GOOGLE_APPLICATION_CREDENTIALS=/path/to/stringtheory-oms-firebase-adminsdk.json

if (!admin.apps.length) {
    const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const credJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

    if (credJson) {
        try {
            const serviceAccount = JSON.parse(credJson);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log("Firebase initialized successfully from JSON string.");
        } catch (e: any) {
            console.error("Firebase init failed from JSON string:", e.message);
        }
    } else if (credPath && !credPath.startsWith('/Users')) {
        // Only attempt to read files if they are not absolute Mac user paths (for Render safety)
        try {
            const serviceAccount = JSON.parse(require('fs').readFileSync(credPath, 'utf8'));
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log("Firebase initialized successfully from env path.");
        } catch (e: any) {
            console.error("Firebase init failed from env path:", e.message);
            admin.initializeApp({
                credential: admin.credential.applicationDefault()
            });
        }
    } else {
        // Just use application default (will work if Render identity is set or if credentials are found by SDK)
        admin.initializeApp({
            credential: admin.credential.applicationDefault()
        });
    }
}

export const db = admin.firestore();
export const auth = admin.auth();
export default admin;
