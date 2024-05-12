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
import Test from '../page/Product/Test'

const router = createBrowserRouter([
    {
        path: '/',
        loader: () => {
            if (!localStorage.getItem('user')) {
                throw redirect(APP_ROUTER.HOME)
            }
            return null
        },
    },
    {
        path: '/',
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
                element: <ProductDetail />
            },
            {
                path: APP_ROUTER.ADD_PRODUCT,
                element: <AddProduct />
            },
            {
                path: APP_ROUTER.CATEGORY,
                element: <Category />
            },

        ],
    },
    
    {
        path: '/test',
        element: <Test />
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
])

export default router