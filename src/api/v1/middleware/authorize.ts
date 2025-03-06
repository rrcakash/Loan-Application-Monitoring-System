import { Request, Response, NextFunction } from "express";
import { AuthorizationOptions } from "../models/authorizationOptions";

/**
 * Middleware to check if a user is authorized based on their role or UID.
 * @param {AuthorizationOptions} opts - The authorization options.
 * @returns {(req: Request, res: Response, next: NextFunction) => void} The middleware function.
 */
const isAuthorized = (opts: AuthorizationOptions) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { role, uid } = res.locals; // Extract user details from res.locals
    const { id } = req.params; // Extract resource ID from request params

    // Allow access if the user is accessing their own data
    if (opts.allowSameUser && id && uid === id) {
      next();
      return;
    }

    // If no role exists on the user, send a 403 response
    if (!role) {
      res.status(403).json({ message: "Forbidden: No role found" });
      return;
    }

    // Check if the user's role is in the allowed roles list
    if (opts.hasRole.includes(role)) {
      next();
      return;
    }

    // If the role is not authorized, send a 403 response
    res.status(403).json({ message: "Forbidden: Insufficient role" });
  };
};

export default isAuthorized;
