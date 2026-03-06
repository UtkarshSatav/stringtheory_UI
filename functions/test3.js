"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const path = process.env.GOOGLE_APPLICATION_CREDENTIALS;
delete process.env.GOOGLE_APPLICATION_CREDENTIALS; // force it to rely on the cert we provide
const firebase_admin_1 = __importDefault(require("firebase-admin"));
console.log("Loaded path:", path);
const serviceAccount = require(path);
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount)
});
const db = firebase_admin_1.default.firestore();
db.collection('products').limit(1).get().then(() => console.log('success')).catch(e => console.error(e.message));
