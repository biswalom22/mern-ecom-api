import express from 'express';
import {
  createCheckoutSession,
  handleStripeWebhook,
} from '../controllers/paymentController';

const router = express.Router();

// Create a Stripe checkout session
router.post('/create-checkout-session', createCheckoutSession);

// Handle Stripe webhook events
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }), // Required for Stripe webhooks
  handleStripeWebhook
);

export default router;