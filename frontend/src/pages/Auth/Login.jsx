import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SummaryApi from "../../common/SummaryApi";
import Axios from "../../utils/Axios";
import AxiosToastError from "../../utils/AxiosToastError";
import toast from "react-hot-toast";
import fetchUserDetails from "../../utils/FetchUserDetails";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../store/userSlice";

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

  return (
    <div className="flex flex-col items-center px-6 mt-4 mx-auto min-h-[60vh] w-full">
      <h1 className="text-xl">Entrar</h1>
      <form onSubmit={handleSubmit} className="w-72 md:w-72 lg:w-80">
        <div className="grid gap-6 mb-6 md:grid-cols-2"></div>
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
    </div>
  );
};

export default Login;
