import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: "product",
          required: true,
        },
        name: { type: String, required: true }, // Nome do produto
        price: { type: Number, required: true }, // Preço unitário
        quantity: { type: Number, required: true }, // Quantidade
      },
    ],
    paymentId: {
      type: String,
      default: "",
    },
    paymentUrl: {
      type: String,
      default: "",
    },
    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    totalAmt: {
      type: Number,
      default: 0,
    },
    invoice_receipt: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Cria automaticamente os campos createdAt e updatedAt
  }
);

const OrderModel = mongoose.model("order", orderSchema);
export default OrderModel;
