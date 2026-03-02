import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

// If running locally, you can pass the path to your service account key in the .env file
// e.g., GOOGLE_APPLICATION_CREDENTIALS=/path/to/stringtheory-oms-firebase-adminsdk.json

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(), // Uses GOOGLE_APPLICATION_CREDENTIALS env var
        projectId: 'stringtheory-oms',
    });
}

export const db = admin.firestore();
export const auth = admin.auth();
export default admin;
