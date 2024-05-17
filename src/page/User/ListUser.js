import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { FaHouseUser } from "react-icons/fa";
const ListUser = () => {
    const [users, setUsers] = useState();
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [searched, setSearched] = useState(false);
    const fetchUser = async () => {
        try {
            const req = await fetch(
                `http://localhost:8080/api/admin/user?page=${page}`
            );
            const res = await req.json();
            if (res.succes) {
                console.log("res.user",res.user)
                setUsers(res.user);
                setSearched(true);
            } else console.log(res.message);
        } catch (error) {
            console.log("Error get list use", error);
        }
    };
    useEffect(() => {
        fetchUser();
    }, [page]);

    const handlePage = (num) => {
        setPage(num);
    };

    const buttonPage = (num) => {
        return [...Array(num)].map((item, index) => (
            <button
            key={index}
                className={`border py-1 px-4 hover:border-blue-400 hover:text-blue-500 ${
                    page === index + 1 ? " border-blue-400 text-blue-500" : ""
                }`}
                onClick={() => handlePage(index + 1)}
            >
                {index + 1}
            </button>
        ));
    };
    const handleSearch = async () => {
        if (searchTerm.trim() !== "") {
            try {
                const req = await fetch(
                    `http://localhost:8080/api/admin/search/user?search=${searchTerm.trim()}`
                );
                const res = await req.json();
                if (res.succes) {
                    setUsers(res);
                    console.log("res.user",res)
                    setSearched(false);
                } else {
                    console.log(res.message);
                }
            } catch (error) {
                console.log("Error searching users", error);
            }
        }
    };
    console.log(users)
    const handleChange = (e) => {
        const { value } = e.target;
        setSearchTerm(value);
        if (value === "") {
            fetchUser();
            setSearched(false);

        }
    };
    return (
        <>
            <div className="font-bold text-3xl mx-auto p-10 text-center flex justify-center items-center">
                <FaHouseUser /> <div className="pl-3">QUẢN LÍ NGƯỜI DÙNG</div>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg pb-10">
                <div className="max-w-md mx-auto">
                    <label
                        htmlFor="default-search"
                        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                    >
                        Tìm kiếm
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <input
                            type="search"
                            id="default-search"
                            name="search"
                            className="block w-full p-4 ps-10 text-sm outline-none text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Tìm kiếm người dùng..."
                            value={searchTerm}
                            onChange={handleChange}
                            required
                        />
                        <button
                            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={handleSearch}
                        >
                            Tìm kiếm
                        </button>
                    </div>
                </div>

                <table className="w-2/3 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mx-auto mt-8">
                    <thead className="text-sm text-gray-700 uppercase dark:text-gray-400">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 bg-gray-100 dark:bg-gray-800"
                            >
                                Ảnh
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 bg-gray-100 dark:bg-gray-800"
                            >
                                Tên người dùng
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 bg-gray-100 dark:bg-gray-800"
                            >
                                Email
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 bg-gray-100 dark:bg-gray-800"
                            >
                                Vai trò
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users ? (
                            users.user.map((user, i) => (
                                <tr
                                    key={i}
                                    className="border-b border-gray-200 dark:border-gray-700"
                                >
                                    <td className="px-6 py-2 bg-gray-50 dark:bg-gray-800">
                                        <img
                                            src={user.Picture}
                                            alt={user.UserName}
                                            className="w-10 h-10 object-cover rounded-full"
                                        />
                                    </td>
                                    <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                                        {user.UserName}
                                    </td>
                                    <td className="px-6 py-2">{user.Email}</td>
                                    <td className="px-6 py-2">{user.RoleId}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-4">
                                    <Spin size="large" />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {searched && (
                    <>
                        <div className="flex gap-2 mt-20 items-center justify-center">
                            {users ? buttonPage(Math.ceil(users?.count / 20)) : null}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default ListUser;
