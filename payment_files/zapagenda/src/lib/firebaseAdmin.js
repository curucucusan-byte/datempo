import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let cachedApp = null;
let cachedDb = null;
let cachedAuth = null;

function required(name, value) {
  if (!value) {
    throw new Error(`Variável ${name} não configurada para Firebase Admin.`);
  }
  return value;
}

export function getFirebaseApp() {
  if (cachedApp) return cachedApp;

  const existing = getApps()[0];
  if (existing) {
    cachedApp = existing;
    return cachedApp;
  }

  const projectId = required("FIREBASE_PROJECT_ID", process.env.FIREBASE_PROJECT_ID);
  const clientEmail = required("FIREBASE_CLIENT_EMAIL", process.env.FIREBASE_CLIENT_EMAIL);
  const privateKey = required("FIREBASE_PRIVATE_KEY", process.env.FIREBASE_PRIVATE_KEY)
    .replace(/\\n/g, "\n");

  const app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });

  cachedApp = app;
  return app;
}

export function getDb() {
  if (cachedDb) return cachedDb;
  const app = getFirebaseApp();
  cachedDb = getFirestore(app);
  return cachedDb;
}

export function getFirebaseAuth() {
  if (cachedAuth) return cachedAuth;
  const app = getFirebaseApp();
  cachedAuth = getAuth(app);
  return cachedAuth;
}
