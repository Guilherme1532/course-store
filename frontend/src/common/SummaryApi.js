export const baseURL = "https://store-api-rho.vercel.app";
// export const baseURL = "http://localhost:8080";

const SummaryApi = {
  register: {
    url: "/api/user/register",
    method: "POST",
  },
  login: {
    url: "/api/user/login",
    method: "POST",
  },
  forgot_password: {
    url: "/api/user/forgot-password",
    method: "PUT",
  },
  verify_otp_forgot_password: {
    url: "/api/user/verify-forgot-password-otp",
    method: "PUT",
  },
  reset_password: {
    url: "/api/user/reset-password",
    method: "PUT",
  },
  verify_email: {
    url: "/api/user/verify-email",
    method: "POST",
  },
  refreshToken: {
    url: "/api/user/refresh-token",
    method: "POST",
  },
  userDetails: {
    url: "/api/user/get-user-details",
    method: "GET",
  },
  logout: {
    url: "/api/user/logout",
    method: "GET",
  },
  uploadAvatar: {
    url: "/api/user/upload-avatar",
    method: "PUT",
  },
  updateUserDetails: {
    url: "/api/user/update-user",
    method: "PUT",
  },
  addCategory: {
    url: "/api/category/create-category",
    method: "POST",
  },
  uploadImage: {
    url: "/api/file/upload",
    method: "POST",
  },
  getCategories: {
    url: "/api/category/get-categories",
    method: "GET",
  },
  deleteCategory: {
    url: "/api/category/delete-category",
    method: "DELETE",
  },
  updateCategory: {
    url: "/api/category/update-category",
    method: "PUT",
  },
  addSubcategory: {
    url: "/api/subcategory/create-subcategories",
    method: "POST",
  },
  getSubcategories: {
    url: "/api/subcategory/get-subcategories",
    method: "GET",
  },
  updateSubcategory: {
    url: "/api/subcategory/update-subcategory",
    method: "PUT",
  },
  deleteSubcategory: {
    url: "/api/subcategory/delete-subcategory",
    method: "DELETE",
  },
  uploadProduct: {
    url: "/api/product/create-product",
    method: "POST",
  },
  getProducts: {
    url: "/api/product/get-products",
    method: "POST",
  },
  updateProduct: {
    url: "/api/product/update-product",
    method: "PUT",
  },
  deleteProduct: {
    url: "/api/product/delete-product",
    method: "DELETE",
  },
  getProductsByCategory: {
    url: "/api/product/category-products",
    method: "GET",
  },
  getProductById: {
    url: "/api/product/get-product-by-id",
    method: "GET",
  },
  getMostViewedProducts: {
    url: "/api/product/most-viewed-products",
    method: "GET",
  },
  addToUserCart: {
    url: "/api/cart/add",
    method: "POST",
  },
  getUserCart: {
    url: "/api/cart/get-cart/:userId",
    method: "GET",
  },
  removeFromUserCart: {
    url: "/api/cart/remove-item",
    method: "DELETE",
  },
  clearUserCart: {
    url: "/api/cart/clear-cart",
    method: "DELETE",
  },
  addAddress: {
    url: "/api/address/add-address",
    method: "POST",
  },
  getUserAddresses: {
    url: "/api/address/get-addresses",
    method: "GET",
  },
  deleteAddress: {
    url: "/api/address/delete-address/",
    method: "DELETE",
  },
  createOrder: {
    url: "/api/order/create-order",
    method: "POST",
  },
  getOrders: {
    url: "/api/order/get-orders",
    method: "GET",
  },
};

export default SummaryApi;
