import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const Order = () => {
    const { id } = useParams()
    const location = useLocation();
    console.log(location)
    // const Name = location.state.data;
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/admin/order/pending`
            );
            setOrders(response.data.order);
            console.log(response.data.order);
        } catch (error) {
            setError("Đã xảy ra lỗi khi lấy dữ liệu đơn hàng");
        }
    };
    useEffect(() => {
        fetchData();
    }, [id]);
  const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };
    return (
        <div className="m-10">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="border-2">
                        <th scope="col" className="text-center px-2 py-3 border-2">
                            OrderId
                        </th>
                        <th scope="col" className="text-center px-2 py-3 border-2">
                            User Name
                        </th>
                        <th scope="col" className="text-center px-2 py-3 border-2">
                            Address
                        </th>
                        <th scope="col" className="text-center px-2 py-3 border-2">
                            Order Date
                        </th>
                        <th scope="col" className="text-center px-2 py-3 border-2">
                            Payment Method
                        </th>
                        <th scope="col" className="text-center px-2 py-3 border-2">
                            Product Name
                        </th>
                        <th scope="col" className="text-center px-2 py-3 border-2">
                            Color
                        </th>
                        <th scope="col" className="text-center px-2 py-3 border-2">
                            Quantity
                        </th>
                        <th scope="col" className="text-center px-2 py-3 border-2">
                            Size
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        order.Products.map((product, index) => (
                            <tr key={`${order.orderID}-${index}`}>
                                {index === 0 && (
                                    <>
                                    <td rowSpan={order.Products.length} className="text-center align-top px-2 py-4 border">
                                            {order.orderID}
                                        </td>
                                        <td rowSpan={order.Products.length} className="align-top px-2 py-4 border">
                                            {order.userName}
                                        </td>
                                        <td rowSpan={order.Products.length} className="align-top px-2 py-4 border">
                                            {order.address}
                                        </td>
                                        <td rowSpan={order.Products.length} className="text-center align-top px-2 py-4 border">
                                            {order.oderDate.toLocaleString('vi-VN', options)}
                                        </td>
                                        <td rowSpan={order.Products.length} className="align-top px-2 py-4 border">
                                            {order.paymentMethod}
                                        </td>
                                    </>
                                )}
                                <td className="px-2 py-4 border">
                                    {product.NameProducts}
                                </td>
                                <td className="text-center px-2 py-4 border">{product.color}</td>
                                <td className="text-center px-2 py-4 border">
                                    {product.quantity}
                                </td>
                                <td className="text-center px-2 py-4 border">{product.size}</td>
                            </tr>
                        ))
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Order;