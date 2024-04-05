import mongoose, { Schema, Document } from "mongoose";

export interface IUserPost extends Document {
  username: string;
  email: string;
  password: string;
}
const userPostSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const userAc = mongoose.model<IUserPost>("UserAc", userPostSchema);

export default userAc;
