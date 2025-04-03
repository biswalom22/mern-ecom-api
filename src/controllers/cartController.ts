import { CartModel } from "../models/cart";

export const addToCart = async (req: any, res: any) => {
  try {
    const { userId, productId, name, price, image, size, quantity } = req.body;

    const existingItem = await CartModel.findOne({ userId, productId, size });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
    } else {
      const newItem = new CartModel({
        userId,
        productId,
        name,
        price,
        image,
        size,
        quantity,
      });
      await newItem.save();
    }

    const updatedCart = await CartModel.find({ userId });

    res.status(200).json(updatedCart);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCartItem = async (req: any, res: any) => {
  try {
    const { itemId } = req.params;
    const { userId, quantity } = req.body;

    const cartItem = await CartModel.findOne({ _id: itemId, userId });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    const updatedCartItems = await CartModel.find({ userId });

    res.status(200).json({ items: updatedCartItems });
  } catch (error: any) {
    console.error("Error updating cart item:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
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

export const removeFromCart = async (req: any, res: any) => {
  try {
    const { itemId } = req.params;
    const { userId } = req.query;
    await CartModel.findByIdAndDelete(itemId);
    const cartItems = await CartModel.find({ userId });
    res
      .status(200)
      .json({ items: cartItems, message: "Item removed from cart" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
