import dotenv from 'dotenv';
dotenv.config();

const path = process.env.GOOGLE_APPLICATION_CREDENTIALS;
delete process.env.GOOGLE_APPLICATION_CREDENTIALS; // force it to rely on the cert we provide

import admin from 'firebase-admin';

console.log("Loaded path:", path);
const serviceAccount = require(path!);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
db.collection('products').limit(1).get().then(() => console.log('success')).catch(e => console.error(e.message));
