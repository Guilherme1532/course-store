import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import OtpVerification from "../pages/Auth/OtpVerification";
import ResetPassword from "../pages/Auth/ResetPassword";
import VerifyEmail from "../pages/Auth/VerifyEmail";
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/ProfileDashboard/Profile";
import MyOrders from "../pages/ProfileDashboard/MyOrders";
import CategoryPage from "../pages/AdminDashboard/CategoryPage";
import SubcategoryPage from "../pages/AdminDashboard/SubcategoryPage";
import UploadProduct from "../pages/AdminDashboard/UploadProduct";
import ProductAdmin from "../pages/AdminDashboard/ProductAdmin";
import AdminPermission from "../layouts/AdminPermission";
import ProductListPage from "../pages/ProductListPage";
import ProductPage from "../pages/ProductPage";
import CartPage from "../pages/Cart/CartPage";
import CheckoutPage from "../pages/Payment/CheckoutPage";
import SuccessCheckoutPage from "../pages/Payment/SuccessCheckoutPage";
import Checkout from "../layouts/Checkout";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "search", element: <SearchPage /> },
      {
        path: "category/:categoryId/:categoryName",
        element: <ProductListPage />,
      },
      { path: "cart", element: <CartPage /> },
      { path: "product/:productId", element: <ProductPage /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "verification-otp", element: <OtpVerification /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "verify-email", element: <VerifyEmail /> },
      {
        path: "checkout",
        element: <Checkout />,
        children: [
          { path: "confirm", element: <CheckoutPage /> },
          { path: "success", element: <SuccessCheckoutPage /> },
        ],
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          { path: "minha-conta", element: <Profile /> },
          { path: "pedidos", element: <MyOrders /> },
          {
            path: "categorias",
            element: (
              <AdminPermission>
                <CategoryPage />
              </AdminPermission>
            ),
          },
          {
            path: "subcategorias",
            element: (
              <AdminPermission>
                <SubcategoryPage />
              </AdminPermission>
            ),
          },
          {
            path: "add-produtos",
            element: (
              <AdminPermission>
                <UploadProduct />
              </AdminPermission>
            ),
          },
          {
            path: "produto-admin",
            element: (
              <AdminPermission>
                <ProductAdmin />
              </AdminPermission>
            ),
          },
        ],
      },
    ],
  },
]);

export default routes;
