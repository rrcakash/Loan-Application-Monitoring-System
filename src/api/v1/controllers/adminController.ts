import { Request, Response } from "express";
import { auth } from "../../../config/firebase"; // Import the auth object from your firebase config

export async function setUserRole(req: Request, res: Response): Promise<void> {
  const { uid, role } = req.body;

  if (!uid || !role) {
    res.status(400).json({ message: "User ID and role are required" });
    return; // Stop further execution if UID or role is missing
  }

  try {
    // Set custom user claims (role) for the given user
    await auth.setCustomUserClaims(uid, { role });
    
    res.status(200).json({ message: `Role '${role}' assigned to user ${uid}` });
  } catch (error: unknown) { // Cast error to `unknown` explicitly
    if (error instanceof Error) {
      // Now TypeScript knows `error` is an instance of `Error`
      console.error("Error setting role:", error);
      res.status(500).json({ message: "Error setting role", error: error.message });
    } else {
      // If error is not an instance of Error, handle it accordingly
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
}
