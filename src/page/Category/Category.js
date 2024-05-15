import React, { useEffect, useState } from "react";
import "../index.css";
import {
    Button,
    Checkbox,
    Col,
    Form,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Space,
    Spin,
    Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import CategoryCard from "../../components/Category/CategoryCard";
import CategorySubCard from "../../components/Category/CategorySubCard";
const { Option } = Select;
const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 14,
    },
};
const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
};

const Category = () => {
    const [formCategory] = Form.useForm();
    const [formCategorySub] = Form.useForm();
    const [categorySub, setCategorySub] = useState();
    const [category, setCategory] = useState();
    const [imageUrl, setImageUrl] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [modalAddCategory, setModalAddCategory] = useState(false);
    const [modalAddCategorySub, setModalAddCategorySub] = useState(false);

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

    const fetchCategorySub = async () => {
        try {
            const req = await fetch(`http://localhost:8080/api/categorysub`);
            const res = await req.json();
            console.log(res);
            if (res.succes) {
                setCategorySub(res.data);
            } else {
                console.error("Không thể lấy dữ liệu category sub:", res.error);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi fetch category sub:", error);
        }
    };
    useEffect(() => {
        fetchCategory();
        fetchCategorySub();
    }, []);

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };
    const onReset = () => {
        formCategorySub.resetFields();
        setImageUrl();
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

    const onFinish = async (values) => {
        console.log(values);
        const valueCategorySub = {
            ...values,
            Name: values.Name.trim(),
            Image: imageUrl,
        };
        console.log("valueCategorySub", valueCategorySub);
        try {
            const req = await fetch(`http://localhost:8080/api/categorysub`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(valueCategorySub),
            });
            const res = await req.json();
            console.log(res);
            if (res.succes) {
                toast.success(res.message);
                fetchCategorySub();
                onReset();
                handleCancel(setModalAddCategorySub);
            } else toast.error(res.message);
        } catch (error) {
            console.error("Error adding product:", error.message);
            throw error;
        }
        // onReset()
    };

    const handleCancel = (setModal) => {
        setModal(false);
    };
    const addCategory = async (value) => {
        console.log("Name", value);
        try {
            const req = await fetch(`http://localhost:8080/api/category`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(value),
            });
            const res = await req.json();
            if (res.succes === true) {
                toast.success(res.message);
                fetchCategory();
                onReset();
                handleCancel(setModalAddCategory);
            } else toast.error(res.message);
        } catch (error) {
            console.error("Error adding category:", error.message);
            throw error;
        }
    };

    return (
        <>
            <div className="font-bold text-3xl mx-auto p-10 text-center">
                QUẢN LÍ DANH MỤC
            </div>
            <div className="mx-5">
                <div className="font-bold text-slate-600 text-2xl mb-5">
                    LOẠI SẢN PHẨM
                </div>
                {category ? (
                    <div className="grid gap-4 grid-cols-6">
                        {category.map((item) => (
                            <CategoryCard
                                key={item.id}
                                value={item}
                                fetchAPICategory={fetchCategory}
                            />
                        ))}
                        <div
                            onClick={() => setModalAddCategory(true)}
                            className="cursor-pointer text-[80px] box-content border-2 hover:border-slate-400 hover:text-slate-400 text-slate-300 border-dashed rounded-2xl text-center "
                        >
                            +
                        </div>
                        <Modal
                            title={
                                <div className="text-2xl font-semibold mb-8">
                                    THÊM LOẠI SẢN PHẨM
                                </div>
                            }
                            open={modalAddCategory}
                            onCancel={() => handleCancel(setModalAddCategory)}
                            footer={null} // Không hiển thị footer mặc định của modal
                        >
                            <Form
                                form={formCategory}
                                name="add-category"
                                onFinish={addCategory}
                            >
                                <Form.Item
                                    label="Tên loại sản phẩm mới"
                                    name="Name"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please input your Field 1!",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item className="mb-0">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="mr-4"
                                    >
                                        Thêm
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            handleCancel(setModalAddCategory)
                                        }
                                    >
                                        Huỷ
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Modal>
                    </div>
                ) : (
                    <div className="text-center mt-10">
                        <Spin size="large" />
                    </div>
                )}
            </div>
            <div className="mx-5 mt-10">
                <div className="font-bold text-slate-600 text-2xl mb-5">
                    CHI TIẾT LOẠI SẢN PHẨM
                </div>
                {categorySub ? (
                    <div className="grid gap-4 grid-cols-4">
                        {categorySub.map((item) => {
                            return <CategorySubCard value={item} fetchAPICategorySub={fetchCategorySub}/>;
                        })}
                        <div
                            onClick={() => setModalAddCategorySub(true)}
                            className="cursor-pointer text-[100px] box-content border-2 hover:border-slate-400 hover:text-slate-400 text-slate-300 border-dashed rounded-2xl p-2 text-center flex justify-center items-center"
                        >
                            +
                        </div>
                        <Modal
                            title={
                                <div className="text-2xl font-semibold mb-8">
                                    THÊM CHI TIẾT LOẠI SẢN PHẨM
                                </div>
                            }
                            open={modalAddCategorySub}
                            onCancel={() =>
                                handleCancel(setModalAddCategorySub)
                            }
                            footer={null} // Không hiển thị footer mặc định của modal
                        >
                            <Form
                                labelAlign="left"
                                {...layout}
                                form={formCategorySub}
                                name="add-categorySub"
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                className="max-w-[800px] bg-[#eff6ff] p-5 rounded-md mx-auto"
                            >
                                <Form.Item
                                    name="Name"
                                    label="Tên loại sản phẩm"
                                    rules={[{ required: true }]}
                                >
                                    <Input />
                                </Form.Item>

                                {category && category.category && (
                                    <Form.Item
                                        label="Loại"
                                        name="CategoryId"
                                        rules={[{ required: true }]}
                                    >
                                        <Select placeholder="Chọn loại sản phẩm">
                                            {category.category.map(
                                                (item, index) => {
                                                    // console.log(item)
                                                    return (
                                                        <Option
                                                            key={index}
                                                            value={item.id}
                                                        >
                                                            {item.Name}
                                                        </Option>
                                                    );
                                                }
                                            )}
                                        </Select>
                                    </Form.Item>
                                )}

                                <Form.Item
                                    label="Ảnh"
                                    rules={[{ required: true }]}
                                >
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
                                            Choose File
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

                                <Form.Item {...tailLayout}>
                                    <div className="flex gap-4">
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            disabled={isLoading}
                                        >
                                            Submit
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                handleCancel(
                                                    setModalAddCategorySub
                                                )
                                            }
                                        >
                                            Huỷ
                                        </Button>
                                        <Button
                                            htmlType="button"
                                            onClick={onReset}
                                        >
                                            Reset
                                        </Button>
                                    </div>
                                </Form.Item>
                            </Form>
                        </Modal>
                    </div>
                ) : (
                    <div className="text-center mt-10">
                        <Spin size="large" />
                    </div>
                )}
            </div>
        </>
    );
};

export default Category;
