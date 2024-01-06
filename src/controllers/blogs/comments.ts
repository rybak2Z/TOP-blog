import express from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { body, param } from "express-validator";
import { handleValidationResult } from "../../utils/handleValidationResult";
import { NextFunction, Request, Response } from "express";
import Comment from "../../models/comment";
import Blog from "../../models/blog";

const router = express.Router({ mergeParams: true });

async function addBlogToReqBody(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const blog = await Blog.findById(req.params.blogId).populate("comments")
    .exec();
  if (blog === null) {
    res.status(404).end();
    return;
  }
  req.body.blog = blog;
  next();
}

// Get all comments under a blog post
router.get(
  "/",
  addBlogToReqBody,
  asyncHandler(async (req, res) => {
    res.json({ comments: req.body.blog.comments });
  }),
);

// Create new comment
function validatePost() {
  return body("body")
    .escape()
    .trim()
    .notEmpty();
}
router.post(
  "/",
  addBlogToReqBody,
  validatePost(),
  handleValidationResult,
  asyncHandler(async (req, res) => {
    const newComment = new Comment({
      author: req.body.userId, // temporal solution until authentication is implemented
      body: req.body.body,
    });
    const savedComment = await newComment.save();
    if (!savedComment) {
      res.status(500).end();
      return;
    }

    const commentIds = req.body.blog.comments.map((comment: any) =>
      comment._id
    );
    const newComments = [...commentIds, savedComment._id];
    await Blog.findByIdAndUpdate(req.params.blogId, { comments: newComments });
    res.status(201).end();
  }),
);

// Delete comment
function validateDelete() {
  return param("commentId")
    .escape()
    .trim()
    .notEmpty()
    .custom((commentId) => mongoose.isValidObjectId(commentId));
}
router.delete(
  "/:commentId",
  addBlogToReqBody,
  validateDelete(),
  handleValidationResult,
  asyncHandler(async (req, res) => {
    const commentId = req.params.commentId;
    const deletedComment = await Comment.findByIdAndDelete(commentId).exec();
    if (deletedComment === null) {
      res.status(404).end();
      return;
    }
    res.end();
  }),
);

export default router;
