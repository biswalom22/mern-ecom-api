import Stripe from "stripe";
import { Request, Response } from "express";
import { CartModel } from "../models/cart";
import { OrderModel } from "../models/order";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { userId, cartItems } = req.body;

    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      metadata: {
        userId,
      },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const handleStripeWebhook = async (req: any, res: any) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      JSON.stringify(req.body),
      sig!,
      endpointSecret
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const cartItems = JSON.parse(session.metadata?.cartItems || "[]");

    if (!userId) {
      console.error("User ID not found in session metadata");
      return res.status(400).send("User ID not found");
    }

    const order = new OrderModel({
      userId,
      items: cartItems,
      totalAmount: session.amount_total! / 100,
      paymentStatus: "paid",
      createdAt: new Date(),
    });

    await order.save();

    await CartModel.deleteMany({ userId });
  }

  res.status(200).send("Webhook processed successfully");
};
