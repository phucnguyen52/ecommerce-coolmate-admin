import { createBrowserRouter, redirect } from 'react-router-dom'
import { APP_ROUTER } from '../utils/Constants'
import MainLayout from '../layout/Main/MainLayout'
import AuthLayout from '../layout/Auth/AuthLayout'
import HomePage from '../page/Home/HomePage'
import Login from '../page/Auth/Login/Login'
import Register from '../page/Auth/Register/Register'
import AddProduct from '../page/Product/AddProduct'
import ListProduct from '../page/Product/ListProduct'
import Category from '../page/Category/Category'
import ProductDetail from '../page/Product/ProductDetail'
import NeedsCollections from "../page/NeedsCollections/NeedsCollections";
import Order from "../page/Order/Order";
import ListUser from "../page/User/ListUser";
import Store from '../page/Store/Store'
import AddStore from '../page/Store/AddStore'
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
                path: '/order/:id',
                element: <Order />,
            },            
            {
                path: APP_ROUTER.LISTUSER,
                element: <ListUser />,
            },
            {
                path: APP_ROUTER.STORE,
                element: <Store />
            },
            {
                path: APP_ROUTER.ADD_STORE,
                element: <AddStore />
            },
        ],
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
