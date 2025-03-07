import { Request, Response, NextFunction } from "express";

// Generic Error Handler middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Set the response status code based on the error statusCode or default to 500
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  res.status(statusCode).json({
    message,
  });
};

export { errorHandler };
