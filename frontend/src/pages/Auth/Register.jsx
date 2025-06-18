import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Axios from "../../utils/Axios.js";
import SummaryApi from "../../common/SummaryApi.js";
import toast from "react-hot-toast";
import AxiosToastError from "../../utils/AxiosToastError.js";

const Register = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  //const navigate = useNavigate();

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const valideValue = Object.values(data).every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    try {
      const response = await Axios({
        ...SummaryApi.register,
        data: data,
      });
      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/login");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="flex flex-col items-center mt-4 mx-auto mb-7 min-h-[80vh] w-full">
      <h1 className="text-xl">Cadastrar</h1>
      <form onSubmit={handleSubmit} className="w-72 md:w-72 lg:w-80">
        <div className="grid gap-6 mb-6 md:grid-cols-2"></div>
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-orange-600"
          >
            Nome
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={data.name}
            onChange={handleChange}
            autoFocus
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 "
            placeholder="Nome Completo"
            required
          />
        </div>
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
            value={data.email}
            onChange={handleChange}
            autoFocus
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 "
            placeholder="john.doe@company.com"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-orange-600"
          >
            Senha
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            autoFocus
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="•••••••••"
            required
          />
          <div
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword((preve) => !preve)}
          >
            Mostrar senha
          </div>
        </div>
        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block mb-2 text-sm font-medium text-orange-600"
          >
            Confirme sua senha
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            autoFocus
            value={data.confirmPassword}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="•••••••••"
            required
          />
        </div>
        <div className="flex items-start mb-6">
          <div className="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              value=""
              className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
              required
            />
          </div>
          <label
            htmlFor="remember"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Eu concordo com os{" "}
            <a href="#" className="text-orange-600 hover:underline">
              termos e condições
            </a>
            .
          </label>
        </div>
        <button
          disabled={!valideValue}
          className={` ${
            valideValue
              ? "text-white bg-gray-900 hover:bg-gray-950 focus:ring-4 focus:outline-none focus:ring-gray-600-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
              : "bg-gray-500 w-full"
          }    text-white py-2 rounded font-semibold my-3 tracking-wide`}
        >
          Cadastrar
        </button>
      </form>
      <Link to={"/login"}>Já possui uma conta? Clique aqui e faça login.</Link>
    </div>
  );
};

export default Register;
