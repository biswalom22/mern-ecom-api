import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: number;
  password: string;
  role: "customer" | "admin";
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    phone: { type: Number, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "customer", enum: ["customer", "admin"] },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
