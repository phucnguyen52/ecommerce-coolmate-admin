import axios from "axios";
import React, { useEffect, useState } from "react";

const OrderWaitConfirm = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8080/api/admin/order/pending"
                );

                setOrders(response.data.order);
                console.log(response.data.order);
            } catch (error) {
                setError("Đã xảy ra lỗi khi lấy dữ liệu đơn hàng");
            }
        };

        fetchData();
    }, []);

    const groupedOrders = orders.reduce((acc, order) => {
        if (!acc[order.orderId]) {
            acc[order.orderId] = [];
        }
        acc[order.orderId].push(order);
        return acc;
    }, {});
    const handleSubmit = async (orderId) => {
        console.log("handleSubmit", orderId);
        // const req = {
        //     StatusOrderId: 2,
        // };
        // console.log("req", req);
        // try {
        //     await axios.put("http://localhost:8080/api/users/me", req, {
        //         withCredentials: true,
        //     });
        //     toast.success("Cập nhật thông tin thành công");
        // } catch (error) {
        //     console.error("Error updating user information:", error);
        //     toast.error("Đã xảy ra lỗi khi cập nhật thông tin");
        // }
    };
    return (
        <div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            User Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Address
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Order Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Payment Method
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Product Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Color
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Quantity
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Size
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Click
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(groupedOrders).map((orderId) => (
                        <React.Fragment key={orderId}>
                            <tr>
                                <th
                                    colSpan="9"
                                    className="px-6 bg-gray-200 dark:bg-gray-700 dark:text-white"
                                >
                                    <hr className="mb-3 flex" />
                                </th>
                            </tr>
                            {groupedOrders[orderId].map((order, index) => (
                                <tr
                                    key={index}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                >
                                    <td className="px-6 py-4">
                                        {order.userName}
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.address}
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.oderDate}
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.paymentMethod}
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.NameProducts}
                                    </td>
                                    <td className="px-6 py-4">{order.color}</td>
                                    <td className="px-6 py-4">
                                        {order.quantity}
                                    </td>
                                    <td className="px-6 py-4">{order.size}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            className="p-2 bg-slate-400 rounded text-black"
                                            onClick={() =>
                                                handleSubmit(
                                                    groupedOrders.orderID
                                                )
                                            }
                                        >
                                            Chuyển trạng thái
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderWaitConfirm;
