import React, { useEffect, useState } from "react";
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
const CollectionCard = (props) => {
    const { value, fetchAPICollection } = props;
    const [form] = useForm();
    const [visible, setVisible] = useState(false);

    // useEffect(()=>{
    //     form.setFieldsValue({ Name: value.Name });
    // },[value])


    const showModal = () => {
        setVisible(true);
    }
    const handleCancel = () => {
        setVisible(false);
    }
    const handleDelete = (id) => {
        confirm({
            title: "Bạn có chắc chắn xoá bộ sưu tập này?",
            icon: <ExclamationCircleFilled />,
            //   content: 'Some descriptions',
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
                console.log(id);
                const handleRemoveCollection = async (id) => {
                    try {
                        const response = await axios.delete(
                            `http://localhost:8080/api/collection/${id}`,
                            {
                                withCredentials: true,
                            }
                        );
                        if (response.status === 200) {
                            if (response.data.succes) {
                                toast.success(response.data.message, {
                                    autoClose: 1000,
                                });
                            } else {
                                toast.warning(response.data.message, {
                                    autoClose: 1000,
                                });
                            }
                            fetchAPICollection();
                        }
                    } catch (error) {
                        console.error(
                            "Lỗi khi gửi yêu cầu xóa bộ sưu tập",
                            error
                        );
                    }
                };
                handleRemoveCollection(id);
            },
            onCancel() {
                console.log("Cancel");
            },
        });
    };



    const onFinish = (values) => {
        if (values.Name.trim() === value.Name) {
            toast.warning('Không có sự thay đổi', {
                autoClose: 1000,
            });
            return 0
        }
        const req = { Name: charUpperCase(values.Name.trim()) };
        const handleUpdateCollection = async () => {
            try {
                const response = await axios.put(
                    `http://localhost:8080/api/collection/${value.id}`,
                    req
                );
                if (response.data.succes) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    fetchAPICollection();
                    toast.success("Đã cập nhật bộ sưu tập thành công", {
                        autoClose: 1000,
                    });
                } else {
                    console.error(
                        "Có lỗi xảy ra khi cập nhật bộ sưu tập:",
                        response.data.message
                    );
                }
            } catch (error) {
                console.error("Có lỗi xảy ra khi cập nhật nhu cầu:", error);
                // Xử lý lỗi nếu cần
            }
        };
        handleUpdateCollection();
        setVisible(false);
    };

    const charUpperCase = (sentence) => {
        sentence = sentence.toLowerCase();
        let words = sentence.split(' ');
        let capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
        let capitalizedSentence = capitalizedWords.join(' ');
        return capitalizedSentence;
    }
    return (
        <>
            <div className="border rounded-2xl p-2 text-center flex flex-col justify-between">
                <div className="text-2xl font-bold p-4 my-auto">
                    {value.Name}
                </div>
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
                                CẬP NHẬT BỘ SƯU TẬP
                            </div>
                        }
                        open={visible}
                        onCancel={handleCancel}
                        footer={null} // Không hiển thị footer mặc định của modal
                    >
                        <Form
                            form={form}
                            name="update-collection"
                            initialValues={{ Name: value.Name }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                label="Tên Bộ sưu tập mới"
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

export default CollectionCard;
