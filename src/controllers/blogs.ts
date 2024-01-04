import express from "express";
import asyncHandler from "express-async-handler";
import { body, param } from "express-validator";
import { handleValidationResult } from "../utils/handleValidationResult";
import mongoose from "mongoose";
import Blog from "../models/blog";
import commentsRouter from "./blogs/comments";

const router = express.Router();
router.use("/:blogId/comments", commentsRouter);

// Get all published blogs
router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const blogs = await Blog.find({ is_published: true }).exec();
    res.json({ blogs });
  }),
);

// Create new blog
function validatePost() {
  return [
    body("title")
      .escape()
      .trim()
      .notEmpty(),
    body("isPublished")
      .escape()
      .isBoolean(),
    body("body")
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
    const { title, isPublished, body } = req.body;
    const newBlog = new Blog({
      title,
      author: req.body.userId, // temporal solution until authentication is implemented
      date: new Date().toISOString(),
      is_published: isPublished,
      body,
      comments: [],
    });
    const savedBlog = await newBlog.save();
    if (!savedBlog) {
      res.status(500).end();
    }
    res.status(201).end();
  }),
);

// Get blog
function validateGetBlogId() {
  return param("blogId")
    .escape()
    .trim()
    .notEmpty()
    .custom((blogId) => mongoose.isValidObjectId(blogId));
}
router.get(
  "/:blogId",
  validateGetBlogId(),
  handleValidationResult,
  asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.blogId).exec();
    if (blog === null) {
      res.status(404).end();
      return;
    }
    res.json({ blog });
  }),
);

// Update blog
function validatePut() {
  return [
    body("title")
      .escape()
      .trim()
      .notEmpty(),
    body("isPublished")
      .escape()
      .isBoolean(),
    body("body")
      .escape()
      .trim()
      .notEmpty(),
  ];
}
router.put(
  "/:blogId",
  validatePut(),
  handleValidationResult,
  asyncHandler(async (req, res) => {
    const blogId = req.params.blogId;
    const { title, isPublished: is_published, body } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
      title,
      is_published,
      body,
    }).exec();
    if (updatedBlog === null) {
      res.status(404).end();
      return;
    }
    res.end();
  }),
);

// Delete blog
function validateDeleteBlogId() {
  return param("blogId")
    .escape()
    .trim()
    .notEmpty()
    .custom((blogId) => mongoose.isValidObjectId(blogId));
}
router.delete(
  "/:blogId",
  validateDeleteBlogId(),
  handleValidationResult,
  asyncHandler(async (req, res) => {
    const blogId = req.params.blogId;
    const deletedBlog = await Blog.findByIdAndDelete(blogId).exec();
    if (deletedBlog === null) {
      res.status(404).end();
      return;
    }
    res.end();
  }),
);

export default router;
