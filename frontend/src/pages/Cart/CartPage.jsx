import React from "react";
import { useSelector } from "react-redux";
import AddToCart from "../../components/AddToCart";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  removeFromCartAsync,
  clearCartAsync,
  clearCart,
} from "../../store/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);

  const handleDeleteFromCart = (product) => () => {
    if (user._id) {
      dispatch(
        removeFromCartAsync({ productId: product._id, userId: user._id })
      );
    } else {
      dispatch(removeFromCart(product._id));
    }
  };
  const handleClearCart = () => {
    if (user._id) {
      dispatch(clearCartAsync(user._id));
    } else {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    }
  };

   const totalValue = cart.items.reduce((total, item) => {
    return total + item.product.price * (item.quantity || 1);
  }, 0);
  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-xl font-bold text-gray-700">
          Seu carrinho está vazio!
        </h2>
        <Link
          to="/"
          className="px-4 py-2 bg-gray-950 text-orange-500 rounded hover:bg-gray-800 transition"
        >
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <section className="max-w-[1024px] mx-auto p-3 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-400 mb-2">
          Meu Carrinho
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cart.items.map((p) => (
            <div
              key={p.product._id}
              className="text-white border p-4 gap-2 rounded flex flex-col justify-center w-full mb-2 bg-gray-700"
            >
              <div className="flex flex-row gap-6 items-center">
                <Link
                  to={`../product/${p.product._id}`}
                  className="min-w-32 min-h-32 bg-white flex justify-center items-center"
                >
                  <img
                    width={100}
                    height={100}
                    src={p.product.image}
                    alt={p.product.name}
                    className=""
                  />
                </Link>
                <div className="w-full">
                  <h2 className="font-bold">{p.product.name}</h2>
                  <h2>R$ {p.product.price}</h2>
                </div>
              </div>
              <div className="w-full flex flex-row gap-2 justify-center items-center">
                <button
                  onClick={handleDeleteFromCart(p.product)}
                  className="cursor-pointer flex items-center justify-between p-3 gap-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
        <div>Valor Total: {totalValue.toFixed(2)} </div>
        <div className="flex flex-row gap-2 justify-between items-center">
          <button
            onClick={handleClearCart}
            className="cursor-pointer flex items-center justify-between p-3 gap-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Esvaziar
          </button>
          <Link
            to={"/checkout/confirm"}
            className="flex items-center justify-between p-3 gap-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
          >
            Confirmar Pedido
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CartPage;
