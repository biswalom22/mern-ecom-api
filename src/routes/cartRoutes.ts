import express from 'express';
import {
  addToCart,
  getCartItems,
  removeFromCart,
} from '../controllers/cartController';

const router = express.Router();

router.post('/cart', addToCart);

router.get('/cart/:userId', getCartItems);

router.delete('/cart/:itemId', removeFromCart);

export default router;