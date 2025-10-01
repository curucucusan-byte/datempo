import type { App } from "firebase-admin/app";
import type { Auth } from "firebase-admin/auth";
import type { Firestore } from "firebase-admin/firestore";

export declare function getFirebaseApp(): App;
export declare function getDb(): Firestore;
export declare function getFirebaseAuth(): Auth;
