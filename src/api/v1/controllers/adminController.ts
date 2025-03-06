import { Request, Response } from "express";
import admin from "src/config/firebase";

export async function setUserRole(req: Request, res: Response): Promise<void> {
  const { uid, role } = req.body;

  if (!uid || !role) {
    res.status(400).json({ message: "User ID and role are required" });
    return; // Make sure to return to stop further execution
  }

  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    res.status(200).json({ message: `Role '${role}' assigned to user ${uid}` });
  } catch (error) {
    res.status(500).json({ message: "Error setting role", error });
  }
}
