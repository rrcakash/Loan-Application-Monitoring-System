import { Request, Response } from "express";
import admin from "src/config/firebase";

// Augmenting the Express Request type in this file as well
declare global {
  namespace Express {
    export interface Request {
      user?: admin.auth.DecodedIdToken; // Add the user property here too
    }
  }
}

export async function getUserDetails(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(400).json({ message: "No user data found in request" });
      return;
    }

    const user = await admin.auth().getUser(req.user.uid); // req.user is valid here
    res.status(200).json({ user }); // Explicitly returning a response here
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details", error });
  }
}
