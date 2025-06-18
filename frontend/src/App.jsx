import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Search from "./components/Search";
import { Toaster } from "react-hot-toast";
import fetchUserDetails from "./utils/FetchUserDetails";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserDetails, logout } from "./store/userSlice";
import { setAllCategory } from "./store/productSlice";
import { setSubcategory } from "./store/productSlice";
import { useSelector } from "react-redux";
import { syncCartOnLogin, fetchUserCart } from "./store/cartSlice";
import Axios from "./utils/Axios";
import SummaryApi from "./common/SummaryApi";
import AxiosToastError from "./utils/AxiosToastError";
import Loading from "./components/Loading";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const token = localStorage.getItem("accessToken");
  const fetchUser = async () => {
    if (!token) return;
    try {
      const userDetails = await fetchUserDetails();
      dispatch(setUserDetails(userDetails.data));
    } catch (error) {
      dispatch(logout());
      AxiosToastError(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getCategories,
      });
      const { data: categoriesResponse } = response;
      if (categoriesResponse.success) {
        dispatch(setAllCategory(categoriesResponse.data));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getSubcategories,
      });
      const { data: subcategoriesResponse } = response;
      if (subcategoriesResponse.success) {
        dispatch(setSubcategory(subcategoriesResponse.data));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
    fetchUser();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user && user._id) {
      if (cart.items.length > 0) {
        dispatch(syncCartOnLogin(user._id));
      } else {
        dispatch(fetchUserCart(user._id));
      }
    }
  }, [user, dispatch]);

  if (loading) {
    return <Loading />;
  } else {
    return (
      <div className="bg-gray-800 font-primary min-h-[100vh] text-white">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
        <Toaster />
      </div>
    );
  }
}

export default App;
