import { useNavigate } from "react-router-dom";
import { FaCheckDouble } from "react-icons/fa";

const SuccessCheckoutPage = () => {
  const navigate = useNavigate();

  return (
    <section className="container mx-auto max-w-[1024px] px-4 py-8">
        <div className="bg-gray-900 p-6 rounded shadow-md">
            <h1 className="text-2xl font-bold mb-4 flex gap-1"><FaCheckDouble size={25} className="text-green-500"/><span>Pagamento bem-sucedido!</span></h1>
            <p className="text-gray-700 mb-4">
            Seu pagamento foi processado com sucesso. Obrigado por sua compra!
            </p>
            <p className="text-gray-600">
            Você receberá um e-mail de confirmação em breve.
            </p>
        </div>
        <button onClick={() => navigate("/dashboard/pedidos")} className="cursor-pointer mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            Ver pedidos
        </button>
    </section>
  );
};

export default SuccessCheckoutPage;
