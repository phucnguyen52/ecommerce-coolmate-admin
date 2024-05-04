import { createBrowserRouter, redirect } from 'react-router-dom'
import { APP_ROUTER } from '../utils/Constants'
import MainLayout from '../layout/Main/MainLayout'
import AuthLayout from '../layout/Auth/AuthLayout'
import HomePage from '../page/Home/HomePage'

import ProductPage from '../page/Product/ProductPage'
import Login from '../page/Auth/Login/Login'
import Register from '../page/Auth/Register/Register'

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
                element: <ProductPage />,
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
])

export default router