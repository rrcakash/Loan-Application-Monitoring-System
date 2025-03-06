import { Request, Response, NextFunction } from "express";
import admin from "src/config/firebase";

// Augmenting the Express Request type
declare global {
  namespace Express {
    export interface Request {
      user?: admin.auth.DecodedIdToken; // Add the user property
    }
  }
}

export async function authenticateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return; // Return after sending a response to ensure the middleware terminates here
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;  // Now TypeScript knows that `user` exists on `req`
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}
