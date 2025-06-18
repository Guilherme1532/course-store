import OrderModel from "../models/order.model.js";
import CartProductModel from "../models/cartproduct.model.js";
import Stripe from "stripe";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createOrder(req, res) {
  try {
    const userId = req.userId; // ID do usuário autenticado
    const email = req.email; // Email do usuário autenticado

    // 1. Consultar o banco de dados para obter os itens do carrinho do usuário
    const cartItems = await CartProductModel.find({ user_id: userId }).populate(
      "product_id"
    );
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Carrinho vazio." });
    }

    // 2. Calcular o valor total dos itens no carrinho
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "brl", // Moeda em reais
        product_data: {
          name: item.product_id.name, // Nome do produto
          description: item.product_id.description, // Descrição do produto
        },
        unit_amount: Math.round(item.product_id.price * 100), // Preço em centavos
      },
      quantity: item.quantity, // Quantidade do produto
    }));

    // 3. Criar uma sessão de checkout no Stripe
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"], // Métodos de pagamento disponíveis
      mode: "payment", // Modo de pagamento único
      customer_email: email, // Email do cliente
      line_items: lineItems, // Itens do carrinho
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`, // URL de sucesso
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`, // URL de cancelamento
    });
    console.log("Sessão de checkout criada:", session);

    // 4. Criar um registro do pedido no banco de dados
    const order = new OrderModel({
      userId: userId,
      products: cartItems.map((item) => ({
        productId: item.product_id._id,
        name: item.product_id.name,
        price: item.product_id.price,
        quantity: item.quantity,
      })),
      totalAmt:
        lineItems.reduce(
          (total, item) => total + item.price_data.unit_amount * item.quantity,
          0
        ) / 100, // Total em reais
      paymentId: session.id,
      payment_status: "pending",
      paymentUrl: session.url,
    });
    await order.save();

    // 4. Retornar a URL de pagamento gerada pelo Stripe
    res.status(200).json({
      success: true,
      message: "Pedido criado com sucesso.",
      url: session.url,
    });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ message: "Erro ao criar pedido." });
  }
}

export async function getOrders(req, res) {
  try {
    const userId = req.userId;

    // 1. Buscar pedidos pendentes do usuário
    const pendingOrders = await OrderModel.find({
      userId,
      payment_status: "pending", // Filtra apenas os pedidos com status "pending"
    });

    // 2. Verificar o status de pagamento no Stripe para cada pedido pendente
    for (const order of pendingOrders) {
      const session = await stripeClient.checkout.sessions.retrieve(
        order.paymentId
      );
      if (session.payment_status === "paid") {
        // Atualizar o status do pedido no banco de dados
        order.payment_status = "paid";
        order.paymentUrl = "";
        await order.save();
      }
    }

    // 3. Retornar todos os pedidos do usuário
    const allOrders = await OrderModel.find({ userId }).populate(
      "products.productId"
    ).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders: allOrders });
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro ao buscar pedidos." });
  }
}
