import CartProductModel from "../models/cartproduct.model.js";
import UserModel from "../models/user.model.js";


export async function addToCart(req, res) {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res
      .status(400)
      .json({ message: "Todos os campos devem estar preenchidos" });
  }
  try {
    const cartProduct = await CartProductModel.findOneAndUpdate(
      { user_id: userId, product_id: productId },
      { quantity: quantity },
      { new: true, upsert: true }
    );
    await UserModel.findByIdAndUpdate(userId, {
      $push: { shopping_cart: cartProduct._id },
    });
    res.status(200).json({
      success: true,
      data: cartProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getCart(req, res) {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const cartProducts = await CartProductModel.find({
      user_id: userId,
    }).populate("product_id");
    res.status(200).json({
      success: true,
      data: cartProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function removeFromCart(req, res) {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res
      .status(400)
      .json({ message: "User ID and Product ID are required" });
  }

  try {
    const cartProduct = await CartProductModel.findOneAndDelete({
      user_id: userId,
      product_id: productId,
    });

    if (!cartProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function clearCart(req, res) {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    await CartProductModel.deleteMany({ user_id: userId });
    await UserModel.findByIdAndUpdate(userId, { $set: { shopping_cart: [] } }); // Limpa o array no user
    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
