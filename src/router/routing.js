import { createBrowserRouter, redirect } from "react-router-dom";
import { APP_ROUTER } from "../utils/Constants";
import MainLayout from "../layout/Main/MainLayout";
import AuthLayout from "../layout/Auth/AuthLayout";
import HomePage from "../page/Home/HomePage";
import Login from "../page/Auth/Login/Login";
import Register from "../page/Auth/Register/Register";
import AddProduct from "../page/Product/AddProduct";
import ListProduct from "../page/Product/ListProduct";
import Category from "../page/Category/Category";
import ProductDetail from "../page/Product/ProductDetail";
import Test from "../page/Product/Test";
import NeedsCollections from "../page/NeedsCollections/NeedsCollections";
import OrderDelivered from "../page/Order/OrderDelivered";
import OrderDelivering from "../page/Order/OrderDelivering";
import OrderTransport from "../page/Order/OrderTransport";
import OrderWaitConfirm from "../page/Order/OrderWaitConfirm";
import Order from "../page/Order/Order";
import ListUser from "../page/User/ListUser";
const router = createBrowserRouter([
    {
        path: "/",
        loader: () => {
            if (!localStorage.getItem("user")) {
                throw redirect(APP_ROUTER.LOGIN);
            }
            return null;
        },
    },
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: APP_ROUTER.HOME,
                element: <HomePage />,
                index: true,
            },
            {
                path: APP_ROUTER.PRODUCT,
                element: <ListProduct />,
                // children: [
                //     {

                //     }
                // ]
            },
            {
                path: APP_ROUTER.PRODUCTDETAIL,
                element: <ProductDetail />,
            },
            {
                path: APP_ROUTER.ADD_PRODUCT,
                element: <AddProduct />,
            },
            {
                path: APP_ROUTER.CATEGORY,
                element: <Category />,
            },
            {
                path: APP_ROUTER.NEEDS_COLLECTIONS,
                element: <NeedsCollections />,
            },
            {
                path: APP_ROUTER.ORDER,
                element: <Order />,
            },
            {
                path: APP_ROUTER.ORDERDELIVERED,
                element: <OrderDelivered />,
            },
            {
                path: APP_ROUTER.ORDERDELIVERING,
                element: <OrderDelivering />,
            },
            {
                path: APP_ROUTER.ORDERTRANS,
                element: <OrderTransport />,
            },
            {
                path: APP_ROUTER.ORDERWAIT,
                element: <OrderWaitConfirm />,
            },
            {
                path: APP_ROUTER.LISTUSER,
                element: <ListUser />,
            },
        ],
    },

    {
        path: "/test",
        element: <Test />,
    },

    {
        path: APP_ROUTER.AUTH,
        element: <AuthLayout />,
        children: [
            {
                path: APP_ROUTER.LOGIN,
                element: <Login />,
                index: true,
            },
            {
                path: APP_ROUTER.REGISTER,
                element: <Register />,
            },
        ],
    },
]);

export default router;
