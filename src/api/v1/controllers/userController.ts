import { Request, Response } from "express";
import { auth } from "../../../config/firebase"; // Import auth correctly

export async function getUserDetails(req: Request, res: Response) {
  try {
    const {uid} = req.params; // Get user ID from the request params

    if (!uid) {
      res.status(400).json({ message: "No user data found in request" });
      return;
    }

    // Directly use auth.getUser(uid) without calling auth.auth()
    const user = await auth.getUser(uid); // Fetch the user by UID

    // If user is not found, handle that error gracefully
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ user }); // Respond with user details
  } catch (error) {
    console.error(error); // Log the error for better debugging
    res.status(500).json({ message: "Error fetching user details", error });
  }
}
