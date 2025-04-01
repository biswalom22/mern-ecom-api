import { CartModel } from '../models/cart';

export const addToCart = async (req: any, res: any) => {
  try {
    const { userId, productId, name, price, image, size, quantity } = req.body;

    const existingItem = await CartModel.findOne({ userId, productId, size });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
    } else {
      const newItem = new CartModel({ userId, productId, name, price, image, size, quantity });
      await newItem.save();
    }

    const updatedCart = await CartModel.find({ userId });

    res.status(200).json(updatedCart); 
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCartItems = async (req: any, res: any) => {
  try {
    const { userId } = req.params;
    const cartItems = await CartModel.find({ userId });
    res.status(200).json(cartItems);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Remove an item from the cart
export const removeFromCart = async (req: any, res: any) => {
  try {
    const { itemId } = req.params;
    await CartModel.findByIdAndDelete(itemId);
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};