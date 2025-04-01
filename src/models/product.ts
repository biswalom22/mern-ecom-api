import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  discount?: number;
  category: string[];
  image: string;
  color: string;
  stock: number;
  brand: string;
  sizes: { size: string; quantity: number }[];
  ratings: number[];
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number },
  category: { type: [String], required: true }, 
  image: { type: String },
  color: { type: String, required: true },
  stock: { type: Number, required: true },
  brand: { type: String, required: true },
  sizes: [
    {
      size: { type: String, required: true }, 
      quantity: { type: Number, required: true },
    },
  ],
  ratings: [{ type: Number }],
});
export default mongoose.model<IProduct>("Product", ProductSchema);
