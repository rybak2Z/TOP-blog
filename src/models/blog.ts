import mongoose from "mongoose";
import User from "./user";
import Comment from "./comment";

const ObjectId = mongoose.SchemaTypes.ObjectId;

const blogSchema = new mongoose.Schema({
  title: String,
  author: { type: ObjectId, ref: User },
  date: Date,
  body: String,
  is_published: Boolean,
  comments: [{ type: ObjectId, ref: Comment }],
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
