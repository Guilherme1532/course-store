import React, { useEffect, useState } from "react";
import UserMenu from "../../components/UserMenu";
import { useDispatch, useSelector } from "react-redux";
import { FaRegUserCircle } from "react-icons/fa";
import EditAvatarProfile from "../../components/EditAvatarProfile";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../utils/AxiosToastError";
import toast from "react-hot-toast";
import { setUserDetails } from "../../store/userSlice";
import fetchUserDetails from "../../utils/FetchUserDetails";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const [openAvatarEditor, setOpenAvatarEditor] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    });
  }, [user]);

  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data: userData,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        const userData = await fetchUserDetails();
        dispatch(setUserDetails(userData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5 flex flex-col gap-3">
      <h1>Meu perfil</h1>
      <div className="w-16 h-16 bg-gray-950 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-full h-full" />
        ) : (
          <FaRegUserCircle />
        )}
      </div>
      <button
        onClick={() => setOpenAvatarEditor(true)}
        className="mt-2 cursor-pointer bg-gray-950 text-sm font-semibold text-orange-600 rounded-full w-16 hover:text-orange-400 flex items-center justify-center hover:scale-105 transition duration-300 ease-in-out"
      >
        Editar
      </button>
      {openAvatarEditor && (
        <EditAvatarProfile close={() => setOpenAvatarEditor(false)} />
      )}
      <form onSubmit={handleSubmit} className="flex flex-col mt-5 text-white">
        <div className="flex flex-col gap-2 mt-5">
          <label htmlFor="name" className="text-sm font-semibold text-gray-500">
            Nome
          </label>
          <input
            type="text"
            placeholder="Digite seu nome"
            name="name"
            value={userData.name}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-950"
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-2 mt-5">
          <label
            htmlFor="email"
            className="text-sm font-semibold text-gray-500"
          >
            Email
          </label>
          <input
            placeholder="Digite seu email"
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-950"
          />
        </div>
        <div className="flex flex-col gap-2 mt-5">
          <label
            htmlFor="mobile"
            className="text-sm font-semibold text-gray-500"
          >
            Telefone
          </label>
          <input
            placeholder="Digite seu telefone"
            type="text"
            name="mobile"
            onChange={handleChange}
            value={userData.mobile}
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-950"
          />
        </div>
        <button
          type="submit"
          className="cursor-pointer mt-5 p-1 bg-gray-950 text-sm font-semibold text-orange-600 rounded-full w-24 hover:text-orange-400 flex items-center justify-center hover:scale-105 transition duration-300 ease-in-out"
        >
          {loading ? "Carregando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
