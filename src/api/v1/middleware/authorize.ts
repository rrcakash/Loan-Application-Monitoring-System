import { Request, Response, NextFunction } from "express";
import { AuthorizationOptions } from "../models/authorizationOptions";

/**
 * Middleware to check if a user is authorized based on their role or UID.
 */
function isAuthorized(opts: AuthorizationOptions) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { role, uid } = res.locals;
    const { id } = req.params;

    if (opts.allowSameUser && id && uid === id) {
      return next();
    }

    if (!role) {
      res.status(403).json({ message: "Forbidden: No role found" });
      return;
    }

    if (opts.hasRole.includes(role)) {
      return next();
    }

    res.status(403).json({ message: "Forbidden: Insufficient role" });
  };
}

export default isAuthorized;
