import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SummaryApi from "../../common/SummaryApi";
import Axios from "../../utils/Axios";
import AxiosToastError from "../../utils/AxiosToastError";
import toast from "react-hot-toast";
import fetchUserDetails from "../../utils/FetchUserDetails";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../store/userSlice";
import { FcGoogle } from "react-icons/fc";
import { baseURL } from "../../common/SummaryApi";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      navigate("/");
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const valideValue = Object.values(data).every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.login,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);

        const userDetails = await fetchUserDetails();
        dispatch(setUserDetails(userDetails.data));

        setData({
          email: "",
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleGoogleLogin = async () => {
    window.location.href = `${baseURL}/api/user/login/google`;
  };

  return (
    <div className="flex flex-col items-center px-6 mt-4 max-w-[400px] mx-auto min-h-[60vh] w-full gap-2">
      <h1 className="text-xl">Entrar</h1>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-orange-600"
          >
            E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            autoFocus
            value={data.email}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 "
            placeholder="john.doe@company.com"
            required
          />
        </div>
        <div className="mb-6 gap-1 flex flex-col">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-orange-600"
          >
            Senha
          </label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
            value={data.password}
            autoFocus
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="•••••••••"
            required
          />
          <Link
            to={"/forgot-password"}
            className="w-full text-end text-gray-400 hover:text-gray-700"
          >
            Esqueceu sua senha?
          </Link>
        </div>

        <button
          disabled={!valideValue}
          className={` ${
            valideValue
              ? "text-white bg-gray-900 hover:bg-gray-950 focus:ring-4 focus:outline-none focus:ring-gray-600-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
              : "bg-gray-500 w-full"
          }    text-white py-2 rounded font-semibold my-3 tracking-wide`}
        >
          Entrar
        </button>
      </form>
      <Link to={"/register"} className="text-center">
        Ainda não tem uma conta? Clique aqui
      </Link>
      <p>ou</p>
      <button
        onClick={handleGoogleLogin}
        className="cursor-pointer w-full p-5 text-black bg-white rounded-lg flex flex-row justify-center items-center gap-3"
      >
        <FcGoogle size={25} />
        Faça login com Google
      </button>
    </div>
  );
};

export default Login;
