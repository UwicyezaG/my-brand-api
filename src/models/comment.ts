import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  name: string;
  content: string;
}

const commentSchema = new Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
});

const comment = mongoose.model<IComment>("Comment", commentSchema);

export default comment;
