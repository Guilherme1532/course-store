import React from "react";
import SummaryApi from "../../common/SummaryApi";
import Axios from "../../utils/Axios";
import { useState } from "react";
import { useEffect } from "react";
import Loading from "../../components/Loading";

const statusTranslations = {
  pending: "Pendente",
  paid: "Pago",
  failed: "Falhou",
  refunded: "Reembolsado",
};

const statusColors = {
  pending: "text-yellow-500", // Cor para "Pendente"
  paid: "text-green-500", // Cor para "Pago"
  failed: "text-red-500", // Cor para "Falhou"
  refunded: "text-gray-500", // Cor para "Reembolsado"
};

const MyOrders = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getMyOrders = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getOrders,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        setOrdersData(response.data.orders);
      } else {
        console.error("Failed to fetch orders:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getMyOrders();
  }, []);

  return (
    <section className="px-2 md:px-0">
      <h1 className="text-2xl font-bold mb-4">Minhas Compras</h1>
      <div className="flex flex-col gap-5">
        {loading ? (
          <Loading />
        ) : (
          <div className="flex flex-col gap-4">
            {ordersData.map((order) => (
              <div
                key={order._id}
                className=" text-xl bg-gray-900 p-4 rounded-lg shadow-md flex justify-between flex-col"
              >
                <h2 className="mb-2 text-xl font-bold flex justify-center gap-1 p-2 bg-gray-800 rounded-lg ">
                  Status:
                  <span
                    className={
                      statusColors[order.payment_status] || "text-gray-500"
                    }
                  >
                    {statusTranslations[order.payment_status] || "Desconhecido"}
                  </span>
                </h2>
                <p className="mb-2">
                  Data do pedido:{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <h3 className="font-semibold mt-4">Produtos:</h3>
                <ul>
                  {order.products.map((product, index) => (
                    <li
                      key={index}
                      className="w-full mb-1 flex bg-gray-800 p-2 rounded-lg justify-between items-center gap-2"
                    >
                      <div>
                        <p>{product.name}</p>
                        <p>R${product.price.toFixed(2)}</p>
                      </div>
                      <img
                        width={30}
                        height={30}
                        src={product.productId.image}
                        alt={product.name}
                      />
                    </li>
                  ))}
                </ul>
                <div>
                  <p className="mt-4 font-bold text-xl">
                    Valor: R${order.totalAmt.toFixed(2)}
                  </p>
                  {order.paymentUrl && (
                    <a
                      href={order.paymentUrl}
                      className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Pagar
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyOrders;
