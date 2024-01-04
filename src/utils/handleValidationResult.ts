import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export function handleValidationResult(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({ errors: result.array() });
    return;
  }
  next();
}
