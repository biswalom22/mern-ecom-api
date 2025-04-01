import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem extends Document {
  userId: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

const cartSchema = new Schema<ICartItem>({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: false },
  size: { type: String, required: true },
  quantity: { type: Number, default: 1 },
});

export const CartModel = mongoose.model<ICartItem>('Cart', cartSchema);