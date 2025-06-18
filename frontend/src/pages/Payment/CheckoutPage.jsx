import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { selectCartTotalPrice, clearCartAsync } from "../../store/cartSlice";
import SummaryApi from "../../common/SummaryApi";
import Axios from "../../utils/Axios";
import AxiosToastError from "../../utils/AxiosToastError";

const CheckoutPage = () => {
  const cart = useSelector((state) => state.cart);
  const totalPrice = useSelector(selectCartTotalPrice);
  const user = useSelector((state) => state.user);
  const token = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast("Faça login ou crie uma conta para continuar.", { icon: "😊" });
      navigate("/login");
      return;
    }
  }, []);

  const handleOnSubmit = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.createOrder,
      });
      const { data: orderResponse } = response;
      if (orderResponse.success) {
        console.log("Order created successfully:", orderResponse);
        await dispatch(clearCartAsync(user._id));
        window.location.href = orderResponse.url;
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="container mx-auto max-w-[1024px] px-4 py-8">
      <h1 className="text-xl font-semibold text-gray-400 mb-2">Checkout</h1>
      <p>Revise seus itens e finalize a compra.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <div className="bg-slate-700 p-4 rounded-lg mb-4 text-white">
          <h2>Itens no carrinho</h2>
          {cart.items.length === 0 ? (
            <p>Seu carrinho está vazio.</p>
          ) : (
            cart.items.map((item) => (
              <div
                key={item.product._id}
                className="flex flex-row mb-4 justify-between items-center w-full bg-gray-600 p-4 gap-2 rounded-lg text-white"
              >
                <div className="w-full">
                  <p>{item.product.name}</p>
                  <p>R$ {item.product.price}</p>
                </div>
                <div>
                  <img width={100} src={item.product.image} alt="" />
                </div>
              </div>
            ))
          )}
        </div>
        {/* <div className="bg-slate-700 p-4 rounded-lg mb-4 text-white">
          <h2>Forma de Pagamento</h2>
          <div className="flex flex-col gap-3 p-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="creditCard"
                checked={paymentMethod === "creditCard"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cartão de Crédito
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="boleto"
                checked={paymentMethod === "boleto"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Boleto Bancário
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="pix"
                checked={paymentMethod === "pix"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              PIX
            </label>
          </div>
        </div> */}
        <div className="bg-slate-700 p-4 rounded-lg mb-4 text-white">
          <div className="flex flex-col gap-3">
            <h2>Resumo do Pedido</h2>
            <p>Total: R$ {totalPrice.toFixed(2)}</p>
            <p>Usuario: {user.name}</p>
            <p>Email: {user.email}</p>
          </div>

          <button
            onClick={handleOnSubmit}
            className="cursor-pointer mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Finalizar Compra
          </button>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
