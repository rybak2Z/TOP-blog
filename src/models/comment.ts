import mongoose from "mongoose";
import User from "./user";

const ObjectId = mongoose.SchemaTypes.ObjectId;

const commentSchema = new mongoose.Schema({
  author: { type: ObjectId, ref: User },
  body: String,
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
