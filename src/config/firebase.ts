import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import  serviceAccount from "../../assignment4-3e20b-firebase-adminsdk-fbsvc-e7f4e33afb.json";
 
// Initialize Firebase Admin SDK
initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
});
 
const auth: Auth = getAuth();
const db: Firestore = getFirestore();
 
export { auth, db };