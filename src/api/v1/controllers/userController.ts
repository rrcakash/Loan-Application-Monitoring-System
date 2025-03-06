import { Request, Response } from "express";
import admin from "src/config/firebase";

export async function getUserDetails(req: Request, res: Response) {
  try {
    const user = await admin.auth().getUser(req.user.uid);
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching user details", error });
  }
}
