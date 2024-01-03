import express, { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { body, param, validationResult } from "express-validator";
import mongoose from "mongoose";
import User from "../models/user";

const router = express.Router();

function handleValidationResult(
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

// Get all users that are writers
router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const allWriters = await User.find({ is_writer: true }).exec();
    res.json({ writers: allWriters });
  }),
);

// Create user
function validatePost() {
  return [
    body("name")
      .escape()
      .trim()
      .notEmpty(),
    body("password")
      .escape()
      .trim()
      .notEmpty(),
  ];
}
router.post(
  "/",
  validatePost(),
  handleValidationResult,
  asyncHandler(async (req, res) => {
    const { name, password } = req.body;
    const user = new User({ name, password, is_writer: false });
    await user.save();
    res.status(201).end();
  }),
);

// Get user
function validateGetUserId() {
  return param("userId")
    .escape()
    .trim()
    .notEmpty()
    .custom((userId) => mongoose.isValidObjectId(userId));
}
router.get(
  "/:userId",
  validateGetUserId(),
  handleValidationResult,
  asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findById(userId).exec();
    if (user === null) {
      res.status(404).end();
      return;
    }
    res.json({ user });
  }),
);

// Update user (only for getting write access)
const validatePutUserId = validateGetUserId;
router.put(
  "/:userId",
  validatePutUserId(),
  handleValidationResult,
  asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    const testPasscode = "test";
    if (req.body.passcode !== testPasscode) {
      res.status(400).json({ message: "Incorrect passcode." });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, {
      is_writer: true,
    }).exec();
    if (updatedUser === null) {
      res.status(404).end();
      return;
    }
    res.end();
  }),
);

export default router;
