import { Request, Response } from "express";
import admin from "src/config/firebase";

export async function setUserRole(req: Request, res: Response) {
  const { uid, role } = req.body;

  if (!uid || !role) {
    return res.status(400).json({ message: "User ID and role are required" });
  }

  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    return res.status(200).json({ message: `Role '${role}' assigned to user ${uid}` });
  } catch (error) {
    return res.status(500).json({ message: "Error setting role", error });
  }
}
