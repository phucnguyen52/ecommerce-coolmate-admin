import { DatePicker, Space } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { format } from "date-fns";

const Order = () => {
    const { id } = useParams();
    console.log(id);
    const [orders, setOrders] = useState([]);
    const [date, setDate] = useState({
        day: new Date().getDate().toString().padStart(2, "0"),
        month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
    });

    const fetchData = async () => {
        try {
            const req = await fetch(
                `http://localhost:8080/api/admin/order/${id}/${date.day}/${date.month}`
            );
            const res = await req.json();
            if (res.succes) {
                const ordersWithTotalPrice = res.order.map((order) => {
                    const totalPrice = order.Products.reduce(
                        (total, product) => total + product.price*product.quantity,
                        0
                    );
                    return {
                        ...order,
                        totalPrice,
                    };
                });
                setOrders(ordersWithTotalPrice);
                console.log(ordersWithTotalPrice);
                console.log("A", ordersWithTotalPrice);
            }
        } catch (error) {
            console.log("Lỗi lấy đơn hàng", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, [id, date]);
    const handleConfirm = async (orderId) => {
        const update = {
            StatusOrderId: Number(id) + 1,
        };
        console.log(update, orderId);
        try {
            const req = await fetch(
                `http://localhost:8080/api/users/order/${orderId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        // Thêm các headers khác nếu cần
                    },
                    body: JSON.stringify(update),
                }
            );
            const res = await req.json();
            console.log(res);
            if (res.succes) {
                toast.success(res.message);
                fetchData();
            } else toast.error("Lỗi chuyển trạng thái");
        } catch (error) {}
    };
    const onChange = (date, dateString) => {
        if (dateString) {
            let month = dateString.slice(5, 7);
            let day = dateString.slice(8, 10);
            setDate({
                day: day,
                month: month,
            });
        }
        // else console.log("null")
        // console.log(dateString, day, month);
    };
    const dateFormat = "YYYY-MM-DD";
    return (
        <div className="m-10">
            <div className="mb-4 text-right">
                <DatePicker
                    onChange={onChange}
                    defaultValue={dayjs(
                        new Date().toISOString().slice(0, 10),
                        dateFormat
                    )}
                    maxDate={dayjs(
                        new Date().toISOString().slice(0, 10),
                        dateFormat
                    )}
                />
            </div>
            <table className="w-full text-sm text-left text-black">
                <thead className="text-xs text-white uppercase bg-black/80">
                    <tr className="border-2">
                        <th
                            scope="col"
                            className="text-center px-2 py-3 border-2"
                        >
                            Mã đơn
                        </th>
                        <th
                            scope="col"
                            className="text-center px-2 py-3 border-2"
                        >
                            Tên khách hàng
                        </th>
                        <th
                            scope="col"
                            className="text-center px-2 py-3 border-2"
                        >
                            Địa chỉ
                        </th>
                        <th
                            scope="col"
                            className="text-center px-2 py-3 border-2"
                        >
                            Ngày đặt hàng
                        </th>
                        <th
                            scope="col"
                            className="text-center px-2 py-3 border-2"
                        >
                            Phương thức thanh toán
                        </th>
                        <th
                            scope="col"
                            className="text-center px-2 py-3 border-2"
                        >
                            Tên sản phẩm
                        </th>
                        <th
                            scope="col"
                            className="text-center px-2 py-3 border-2"
                        >
                            Màu sắc
                        </th>
                        <th
                            scope="col"
                            className="text-center px-2 py-3 border-2"
                        >
                            Số lượng
                        </th>
                        <th
                            scope="col"
                            className="text-center px-2 py-3 border-2"
                        >
                            Kích thước
                        </th>
                        <th
                            scope="col"
                            className="text-center px-2 py-3 border-2"
                        >
                            Tổng thanh toán
                        </th>
                        {id !== "4" && (
                            <th
                                scope="col"
                                className="text-center px-2 py-3 border-2"
                            >
                                Chuyển trạng thái
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) =>
                        order.Products.map((product, index) => (
                            <tr key={`${order.orderID}-${index}`}>
                                {index === 0 && (
                                    <>
                                        <td
                                            rowSpan={order.Products.length}
                                            className="text-center align-top px-2 py-4 border"
                                        >
                                            {order.orderID}
                                        </td>
                                        <td
                                            rowSpan={order.Products.length}
                                            className="align-top px-2 py-4 border no"
                                        >
                                            {order.userName}
                                        </td>
                                        <td
                                            rowSpan={order.Products.length}
                                            className="align-top px-2 py-4 border"
                                        >
                                            {order.address}
                                        </td>
                                        <td
                                            rowSpan={order.Products.length}
                                            className="text-center align-top px-2 py-4 border"
                                        >
                                            {format(
                                                new Date(order.oderDate),
                                                "dd/MM/yyyy HH:mm:ss"
                                            )}
                                        </td>
                                        <td
                                            rowSpan={order.Products.length}
                                            className="align-top px-2 py-4 border"
                                        >
                                            {order.paymentMethod}
                                        </td>
                                        {/* <td
                                            rowSpan={order.Products.length}
                                            className="align-top px-2 py-4 border"
                                        >
                                            {order.totalPrice}
                                        </td> */}
                                    </>
                                )}
                                <td className="px-2 py-4 border">
                                    {product.NameProducts}
                                </td>
                                <td className="text-center px-2 py-4 border">
                                    {product.color}
                                </td>
                                <td className="text-center px-2 py-4 border">
                                    {product.quantity}
                                </td>
                                <td className="text-center px-2 py-4 border">
                                    {product.size}
                                </td>

                                {index === 0 && (
                                    <td
                                        rowSpan={order.Products.length}
                                        className="text-center px-2 py-4 border"
                                    >
                                        {order
                                            ? Math.round(
                                                  order.totalPrice
                                              ).toLocaleString("vi-VN")
                                            : ""}
                                        .000
                                    </td>
                                )}
                                {index === 0 && id !== "4" && (
                                    <td
                                        rowSpan={order.Products.length}
                                        className="align-top px-2 py-4 border"
                                    >
                                        <button
                                            onClick={() =>
                                                handleConfirm(order.orderID)
                                            }
                                            className="bg-blue-600 text-white p-2 rounded-md"
                                        >
                                            Xác nhận
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Order;
