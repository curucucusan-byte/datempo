import { initializeApp, getApps, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

let clientApp: FirebaseApp | null = null;
let clientAuth: Auth | null = null;

function required(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Variável ${name} não configurada para Firebase Web.`);
  }
  return value;
}

function getFirebaseConfig() {
  const config: FirebaseOptions = {
    apiKey: required("NEXT_PUBLIC_FIREBASE_API_KEY", process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
    authDomain: required("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
    projectId: required("NEXT_PUBLIC_FIREBASE_PROJECT_ID", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
    messagingSenderId: required(
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
    ),
    appId: required("NEXT_PUBLIC_FIREBASE_APP_ID", process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
  };

  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim();
  if (storageBucket) {
    config.storageBucket = storageBucket;
  }

  return config;
}

export function getClientApp() {
  if (clientApp) return clientApp;
  if (getApps().length) {
    clientApp = getApps()[0]!;
    return clientApp;
  }
  clientApp = initializeApp(getFirebaseConfig());
  return clientApp;
}

export function getClientAuth() {
  if (clientAuth) return clientAuth;
  clientAuth = getAuth(getClientApp());
  return clientAuth;
}
