import axios from "axios";
import SummaryApi from "../common/SummaryApi";
import { baseURL } from "../common/SummaryApi";
import toast from "react-hot-toast";

const Axios = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

Axios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken"); // Ou estado React
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 (não autorizado) e não for uma tentativa de retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marca para evitar loop

      try {
        // Tenta renovar o access token usando o refresh token
        const refreshResponse = await Axios({
          ...SummaryApi.refreshToken,
          data: {
            refreshToken: localStorage.getItem("refreshToken"),
          },
        });
        const newAccessToken = refreshResponse.data.accessToken;
        // Atualiza o access token no localStorage (se estiver usando)
        localStorage.setItem(
          "accessToken",
          refreshResponse.data.data.accessToken
        );

        // Repete a requisição original com o novo token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return Axios(originalRequest);
      } catch (refreshError) {
        // Se o refresh falhar, limpa o localStorage e redireciona
        localStorage.clear(); // Limpa todos os dados
        window.location.href = "/login"; // Redireciona para login
        toast.error("Sessão expirada. Faça login novamente.");
        return Promise.reject(refreshError);
      }
    } else if (error.response?.status === 403) {
      window.location.href = "/";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default Axios;
