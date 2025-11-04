import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layouts/MainLayout";
import HomePage from "../pages/HomePage";
import ProductList from "../pages/Products/productList";
import ProductDetails from "../pages/Products/productDetails";
import OrderList from "../pages/Orders/order";
import OrderDetailPage from "../pages/Orders/orderDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Account from "../pages/Account";
import Wishlist from "../pages/Wishlist";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "products",
        element: <ProductList />,
      },
      {
        path: "productdetails/:id",
        element: <ProductDetails />,
      },
      {
        path: "order",
        element: <OrderList />,
      },
      {
        path: "orderdetails/:id",
        element: <OrderDetailPage />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "Register",
        element: <Register />,
      },
      {
        path: "account",
        element: <Account />,
      },
      {
        path: "wishlist",
        element: <Wishlist />,
      },
    ],
  },
]);