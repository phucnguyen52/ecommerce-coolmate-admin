import React, { useState } from "react";
import {
    ExclamationCircleFilled,
    DeleteOutlined,
    EditOutlined,
} from "@ant-design/icons";
import { Modal, Form, Input, Button } from "antd";
import { toast } from "react-toastify";
import axios from "axios";
const { confirm } = Modal;
const { useForm } = Form;
const CategoryCard = (props) => {
    const { value, fetchAPICategory } = props;
    // console.log(value)
    const handleDelete = (id) => {
        confirm({
            title: "Bạn có chắc chắn xoá loại sản phẩm này?",
            icon: <ExclamationCircleFilled />,
            //   content: 'Some descriptions',
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
                console.log(id);
                const handleRemoveCategory = async (id) => {
                    try {
                        const response = await axios.delete(
                            `http://localhost:8080/api/category/${id}`,
                            {
                                withCredentials: true,
                            }
                        );
                        if (response.status === 200) {
                            console.log("Xóa danh mục thành công.");
                            toast.success("Đã xóa danh mục thành công", {
                                position: "top-right",
                                autoClose: 1000,
                                hideProgressBar: true,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
                            fetchAPICategory();
                        }
                    } catch (error) {
                        console.error(
                            "Lỗi khi gửi yêu cầu xóa bộ sưu tập",
                            error
                        );
                    }
                };
                handleRemoveCategory(id);
            },
            onCancel() {
                console.log("Cancel");
            },
        });
    };

    const [form] = useForm();

    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const onFinish = async (values) => {
        if (values.Name === value.Name) {
            toast.warning("Không có sự thay đổi", {
                autoClose: 1000,
            });
            return 0;
        }
        const data = { Name: values.Name };
        const handleUpdateCategory = async () => {
            try {
                const req = await fetch(
                    `http://localhost:8080/api/category/${value.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                    }
                );
                const res = await req.json();
                if (res.succes) {
                    await fetchAPICategory();
                    toast.success("Đã cập nhật danh mục thành công", {
                        position: "top-right",
                        autoClose: 1000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else {
                    toast.warning(toast.warning(res.message));
                }
            } catch (error) {
                console.error(
                    "Có lỗi xảy ra khi cập nhật chi tiết danh mục:",
                    error
                );
                // Xử lý lỗi ở đây nếu cần
                toast.error("Có lỗi xảy ra khi cập nhật chi tiết danh mục", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        };
        await handleUpdateCategory();
        setVisible(false); // Ẩn modal sau khi submit thành công
    };
    return (
        <>
            <div className="border rounded-2xl p-2 text-center flex flex-col justify-between">
                <div className="text-2xl font-bold p-4">{value.Name}</div>
                <div>
                    <div className="flex gap-4 justify-center">
                        <button
                            className="py-1 px-2 border rounded-md hover:border-slate-500"
                            onClick={showModal}
                        >
                            <EditOutlined /> Sửa
                        </button>
                        <button
                            className="py-1 px-2 border rounded-md hover:border-red-600 text-red-500"
                            onClick={() => handleDelete(value.id)}
                        >
                            <DeleteOutlined /> Xoá
                        </button>
                    </div>

                    <Modal
                        title={
                            <div className="text-2xl font-semibold mb-8">
                                CẬP NHẬT LOẠI SẢN PHẨM
                            </div>
                        }
                        visible={visible}
                        onCancel={handleCancel}
                        footer={null} // Không hiển thị footer mặc định của modal
                    >
                        <Form
                            form={form}
                            name="myForm"
                            initialValues={{ Name: value.Name }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                label="Tên Loại sản phẩm mới"
                                name="Name"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item className="mb-0">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="mr-4"
                                >
                                    Cập nhật
                                </Button>
                                <Button onClick={handleCancel}>Cancel</Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        </>
    );
};

export default CategoryCard;
