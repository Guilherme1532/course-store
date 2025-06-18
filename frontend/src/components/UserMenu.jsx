import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import { logout } from "../store/userSlice";
import { clearCart } from "../store/cartSlice";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { LuLogOut } from "react-icons/lu";
import IsAdmin from "../utils/IsAdmin";

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleCloseMenu = () => {
    if (close) {
      close();
    }
  };

  const handleLogout = async () => {
    handleCloseMenu();

    try {
      const response = await Axios({
        ...SummaryApi.logout,
      });
      if (response.data.success) {
        dispatch(logout());
        localStorage.clear();
        dispatch(clearCart());
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="w-full text-orange-600 mb-2">
      {!user._id ? (
        <div className="flex flex-col gap-2 text-lg">
          <Link
            onClick={handleCloseMenu}
            to={"/login"}
            className=" hover:orange-400"
          >
            Login
          </Link>
          <Link
            onClick={handleCloseMenu}
            to={"/register"}
            className=" hover:orange-400"
          >
            Criar conta
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2 justify-center items-center">
          <div className="w-full flex flex-col gap-1 mb-2 shadow-md pb-2">
            <div className="text-lg font-semibold">Minha conta</div>

            <Link
              to={"/dashboard/minha-conta"}
              onClick={handleCloseMenu}
              className="flex items-center gap-2 bg-gray-900 rounded-lg p-2"
            >
              <div className="text-sm">{user.name || user.mobile}</div>
            </Link>
          </div>
          <div className="text-sm flex flex-col gap-2 w-full">
            {IsAdmin(user.role) && (
              <div>
                <h1 className="text-lg font-bold mb-4">
                  Painel de Administração
                </h1>
                <div className="flex flex-col gap-2 mb-2 shadow-md pb-2">
                  <Link
                    to={"/dashboard/categorias"}
                    onClick={handleCloseMenu}
                    className="bg-gray-900 rounded-lg p-2"
                  >
                    Categorias
                  </Link>
                  <Link
                    to={"/dashboard/subcategorias"}
                    onClick={handleCloseMenu}
                    className="bg-gray-900 rounded-lg p-2"
                  >
                    Subcategorias
                  </Link>
                  <Link
                    to={"/dashboard/produto-admin"}
                    onClick={handleCloseMenu}
                    className="bg-gray-900 rounded-lg p-2"
                  >
                    Produtos
                  </Link>
                  <Link
                    to={"/dashboard/add-produtos"}
                    onClick={handleCloseMenu}
                    className="bg-gray-900 rounded-lg p-2"
                  >
                    Adicionar Produtos
                  </Link>
                </div>
              </div>
            )}

            <Link
              to={"/dashboard/pedidos"}
              onClick={handleCloseMenu}
              className="bg-gray-900 rounded-lg p-2"
            >
              Meus Pedidos
            </Link>
            <div className="flex flex-row gap-2 justify-between items-center">
              <button
                onClick={handleLogout}
                className="cursor-pointer flex p-2 items-center bg-red-500 rounded-lg text-white hover:scale-105 transition duration-300 ease-in-out"
              >
                Sair
                <LuLogOut className="text-lg" />
              </button>
              {close && (
                <button
                  onClick={handleCloseMenu}
                  className="cursor-pointer flex p-2 items-center bg-orange-700 rounded-lg text-white hover:scale-105 transition duration-300 ease-in-out"
                >
                  Fechar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
