import { Request, Response, NextFunction } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { auth } from "../../../config/firebase"; // Import your Firebase config

// Middleware to authenticate a user using a Firebase ID token
const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Extract token from Authorization header (Bearer <token>)
  const token: string | undefined = req.headers.authorization?.split(" ")[1];

  if (!token) {
    // If no token is provided, send a 401 response and stop further execution
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return; // Stops further execution
  }

  try {
    // Verify the Firebase ID token
    const decodedToken: DecodedIdToken = await auth.verifyIdToken(token);

    // Attach user information to the request object
    res.locals.uid = decodedToken.uid;
    res.locals.role = decodedToken.role; // Assuming role is part of custom claims

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If there is an error (invalid token, expired token, etc.), send a 401 response
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default authenticate;
