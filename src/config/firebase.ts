import admin from "firebase-admin";
import * as serviceAccount from "../../assignment4-3e20b-firebase-adminsdk-fbsvc-e7f4e33afb.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;
