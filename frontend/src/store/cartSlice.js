import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

const initialState = JSON.parse(localStorage.getItem("cart")) || {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
    },
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items.find(
        (item) => item.product._id === product._id
      );
      if (existing) {
        toast("Curso já adicionado ao carrinho!", {
          icon: "👏",
        });
      } else {
        state.items.push({ product, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(
        (item) => item.product._id !== productId
      );
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.product._id === productId);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const addToCartAsync =
  ({ product, userId }) =>
  async (dispatch, getState) => {
    const cart = getState().cart;
    const exists = cart.items.some((item) => item.product._id === product._id);
    if (exists) {
      toast("Curso já adicionado ao carrinho!", { icon: "👏" });
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.addToUserCart,
        data: {
          productId: product._id,
          quantity: 1,
          userId: userId,
        },
      });
      const { data } = response;
      if (data.success) {
        toast.success("Curso adicionado ao carrinho!");
        dispatch(addToCart(product)); // Só adiciona localmente se sucesso no backend
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Erro ao adicionar ao carrinho.");
    }
  };

export const fetchUserCart = (userId) => async (dispatch) => {
  try {
    const response = await Axios({
      ...SummaryApi.getUserCart, // Certifique-se que este objeto tem o método e url corretos
      params: { userId },
    });
    const { data } = response;
    if (data.success && Array.isArray(data.data)) {
      // Mapeia para o formato esperado pelo Redux
      const items = data.data.map((item) => ({
        product: item.product_id,
        quantity: item.quantity,
      }));
      dispatch(setCart(items));
    }
  } catch (error) {
    console.error(error);
  }
};

export const removeFromCartAsync =
  ({ productId, userId }) =>
  async (dispatch) => {
    try {
      const response = await Axios({
        ...SummaryApi.removeFromUserCart,
        data: { productId, userId },
      });
      const { data } = response;
      if (data.success) {
        toast.success("Produto removido do carrinho!");
        dispatch(removeFromCart(productId));
      } else {
        toast.error(data.message || "Erro ao remover do carrinho.");
      }
    } catch (error) {
      console.error("Erro ao remover do carrinho:", error);
      toast.error("Erro ao remover do carrinho.");
    }
  };

export const clearCartAsync = (userId) => async (dispatch) => {
  try {
    const response = await Axios({
      ...SummaryApi.clearUserCart, // Exemplo: { method: "DELETE", url: "/api/cart/clear" }
      data: { userId }, // ou params, conforme seu backend espera
    });
    const { data } = response;

    if (data.success) {
      await dispatch(clearCart());
    } else {
      toast.error(data.message || "Erro ao esvaziar o carrinho.");
    }
  } catch (error) {
    console.error("Erro ao esvaziar o carrinho:", error);
  }
};
export const syncCartOnLogin = (userId) => async (dispatch, getState) => {
  const cart = getState().cart.items;
  try {
    // 1. Limpa o carrinho do usuário no banco
    await Axios({
      ...SummaryApi.clearUserCart,
      data: { userId },
    });

    // 2. Adiciona todos os itens do Redux/localStorage ao banco
    for (const item of cart) {
      await Axios({
        ...SummaryApi.addToUserCart,
        data: {
          productId: item.product._id,
          quantity: item.quantity,
          userId,
        },
      });
    }
    await dispatch(fetchUserCart(userId));
  } catch (error) {
    console.error(error);
  }
};

// Salva o carrinho no localStorage sempre que mudar
export const persistCart = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();
  localStorage.setItem("cart", JSON.stringify(state.cart));
  return result;
};

export const selectCartTotalPrice = (state) => {
  return state.cart.items.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
};

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } =
  cartSlice.actions;
export default cartSlice.reducer;
