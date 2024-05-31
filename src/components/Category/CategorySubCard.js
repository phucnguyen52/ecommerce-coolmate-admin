import React, { useEffect, useState } from "react";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal, Form, Input, Button, Upload, Select } from "antd";
import {
    UploadOutlined,
    DeleteOutlined,
    EditOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import axios from "axios";
const { confirm } = Modal;
const { useForm } = Form;
const { Option } = Select;
const CategorySubCard = (props) => {
    const { value, fetchAPICategorySub } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [category, setCategory] = useState();
    const [form] = useForm();
    const [visible, setVisible] = useState(false);
    const [imageUrl, setImageUrl] = useState(value.Image);
    // console.log(value)

    const showModal = () => {
        setVisible(true);
    };
    const handleCancel = () => {
        setVisible(false);
    };

    const fetchCategory = async () => {
        try {
            const req = await fetch(`http://localhost:8080/api/category`);
            const res = await req.json();
            if (res.succes) {
                setCategory(res.category);
            } else {
                console.error("Không thể lấy dữ liệu category:", res.error);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi fetch category:", error);
        }
    };
    useEffect(() => {
        fetchCategory();
    }, []);
    const handleDelete = (id) => {
        confirm({
            title: "Bạn có chắc chắn xoá chi tiết loại sản phẩm này?",
            icon: <ExclamationCircleFilled />,
            //   content: 'Some descriptions',
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
                console.log(id);
                const handleRemoveCategorysub = async (id) => {
                    try {
                        const response = await axios.delete(
                            `http://localhost:8080/api/categorysub/${id}`,
                            {
                                withCredentials: true,
                            }
                        );
                        if (response.status === 200) {
                            if(response.data.succes){
                                toast.success(response.data.message, {
                                    autoClose: 1000,
                                });
                            } else {
                                toast.warning(response.data.message, {
                                        autoClose: 1000,
                                    });
                            }                           
                            
                            fetchAPICategorySub();
                        }
                    } catch (error) {
                        console.error(
                            "Lỗi khi gửi yêu cầu xóa chi tiết danh mục",
                            error
                        );
                    }
                };
                handleRemoveCategorysub(id);
            },
            onCancel() {
                console.log("Cancel");
            },
        });
    };

    const onFinish = (values) => {
        const data = {
            Image: imageUrl,
            CategoryId: values.CategoryId,
        };

        if (values.Name !== value.Name) {
            data.Name =charUpperCase(values.Name);
            // console.log("test", values.Name,value.Name);
        }
        const handleUpdateCategorySub = async () => {
            try {
                const req = await fetch(`http://localhost:8080/api/categorysub/${value.id}`,
                {
                    method: "PUT",
                    headers: {
                       "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                 })
                 const res = await req.json();
                if (res.succes) {
                    console.log("Đã cập nhật chi tiết danh mục thành công");
                    await new Promise(resolve => setTimeout(resolve, 500));
                    await fetchAPICategorySub();
                    toast.success("Đã cập nhật chi tiết danh mục thành công", {
                        autoClose: 1000,
                    });
                } else {
                    toast.warning(
                        toast.warning(res.message)
                    );
                }
            } catch (error) {
                console.error(
                    "Có lỗi xảy ra khi cập nhật chi tiết danh mục:",
                    error
                );
                // Xử lý lỗi ở đây nếu cần
                toast.error("Có lỗi xảy ra khi cập nhật chi tiết danh mục", {
                    autoClose: 1000,
                });
            }
        };

        handleUpdateCategorySub();

        setVisible(false); // Ẩn modal sau khi submit thành công
    };

    const handleBeforeUpload = async (file) => {
        const formData = new FormData();
        formData.append("images", file);

        // Gửi yêu cầu POST đến API
        try {
            setIsLoading(true);
            const response = await fetch("http://localhost:8080/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data) setIsLoading(false);
            setImageUrl(data[0]);
        } catch (error) {
            console.error("Error uploading images:", error);
        }

        // Ngăn chặn quá trình tải lên mặc định của Upload
        return false;
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
                <img
                    className="w-full h-[350px] object-cover"
                    src={value.Image}
                    alt=""
                />
                <div className="text-xl font-bold p-4">{value.Name}</div>
                <div>
                    <div className="flex justify-evenly">
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
                        open={visible}
                        onCancel={handleCancel}
                        footer={null} // Không hiển thị footer mặc định của modal
                    >
                        <Form
                            form={form}
                            name="update-categorysub"
                            initialValues={{
                                Name: value.Name,
                                CategoryId: value.CategoryId,
                            }}
                            onFinish={(e) => onFinish(e)}
                        >
                            <Form.Item
                                label="Tên chi tiết loại sản phẩm mới"
                                name="Name"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item>
                            {category && (
                                <Form.Item
                                    name="CategoryId"
                                    label="Loại"
                                    rules={[{ required: true }]}
                                >
                                    <Select placeholder="Chọn loại">
                                        {category.map((item, index) => {
                                            // console.log(item)
                                            return (
                                                <Option
                                                    key={index}
                                                    value={item.id}
                                                >
                                                    {item.Name}
                                                </Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            )}
                            <Form.Item label="Ảnh">
                                <Upload
                                    beforeUpload={handleBeforeUpload}
                                    showUploadList={false} // Ẩn danh sách tệp đã chọn
                                    className="flex"
                                >
                                    <Button
                                        className="mb-4"
                                        icon={<UploadOutlined />}
                                        loading={isLoading}
                                    >
                                        Choose File Other
                                    </Button>
                                    {imageUrl && (
                                        <img
                                            src={imageUrl}
                                            alt="Uploaded"
                                            className="w-[150px] h-[200px] object-cover rounded-md"
                                        />
                                    )}
                                </Upload>
                            </Form.Item>

                            <Form.Item className="mb-0">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="mr-4"
                                    loading={isLoading}
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

export default CategorySubCard;
