import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user";
import { IProduct } from "./product";
import { OrderStatus, ReturnStatus } from "../enums/enums";

export interface IOrder extends Document {
  user: IUser["_id"];
  products: { product: IProduct["_id"]; quantity: number }[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  deliveredAt: Date;
  returnRequested?: boolean;
  returnReason?: string;
  returnStatus?: ReturnStatus;
}

const OrderSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    default: OrderStatus.PENDING,
    enum: Object.values(OrderStatus),
  },
  createdAt: { type: Date, default: Date.now },
  deliveredAt: { type: Date },
  returnRequested: { type: Boolean, default: false },
  returnReason: { type: String },
  returnStatus: {
    type: String,
    enum: Object.values(ReturnStatus),
  },
});

export const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);
