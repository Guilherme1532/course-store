import SummaryApi from "../common/SummaryApi";
import Axios from "./Axios";

const fetchUserDetails = async () => {
  try {
    const response = await Axios({
      ...SummaryApi.userDetails,
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      // O servidor respondeu com um código de status fora do intervalo de 2xx
      console.error("Erro na resposta do servidor:", error.response.data);
    } else if (error.request) {
      // A solicitação foi feita, mas não houve resposta
      console.error("Nenhuma resposta recebida:", error.request);
    } else {
      // Algo aconteceu ao configurar a solicitação que acionou um erro
      console.error("Erro ao configurar a solicitação:", error.message);
    }
    throw error; // Re-throw the error for further handling if needed
  }
};

// Método para limpar dados de autenticação

export default fetchUserDetails;
