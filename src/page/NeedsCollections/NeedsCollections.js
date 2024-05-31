import React, { useEffect, useState } from "react";
import "../index.css";
import { Button, Form, Input, Modal, Spin } from "antd";

import { toast } from "react-toastify";
import CollectionCard from "./CollectionCard";
import NeedCard from "./NeedCard";

const NeedsCollections = () => {
    const [formCollection] = Form.useForm();
    const [formNeed] = Form.useForm();
    const [modalAddCollection, setModalAddCollection] = useState(false);
    const [modalAddNeed, setModalAddNeed] = useState(false);
    const [collection, setCollection] = useState();
    const [need, setNeed] = useState();

    const fetchCollection = async () => {
        try {
            const req = await fetch(`http://localhost:8080/api/collection`);
            const res = await req.json();
            if (res.succes) {
                setCollection(res.collection);
            } else {
                console.error("Không thể lấy dữ liệu collection:", res.error);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi fetch collection:", error);
        }
    };

    const fetchNeed = async () => {
        try {
            const req = await fetch(`http://localhost:8080/api/need`);
            const res = await req.json();
            if (res.succes) {
                setNeed(res.needs);
            } else {
                console.error("Không thể lấy dữ liệu needs:", res.error);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi fetch needs:", error);
        }
    };
    useEffect(() => {
        fetchCollection();
        fetchNeed();
    }, []);

    const handleCancel = (setModal) => {
        setModal(false);
    };
    const addCollection = async (value) => {
        console.log("Name", value);
        value.Name = charUpperCase(value.Name)
        try {
            const req = await fetch(`http://localhost:8080/api/collection`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(value),
            });
            const res = await req.json();
            if (res.succes === true) {
                toast.success(res.message);
                fetchCollection();
                handleCancel(setModalAddCollection);
                console.log(modalAddCollection);
            } else toast.error(res.message);
        } catch (error) {
            console.error("Error adding collection:", error.message);
            throw error;
        }
    };
    const addNeed = async (values) => {
        console.log("NeedName", values);
        values.NeedName = charUpperCase(values.NeedName)
        try {
            const req = await fetch(`http://localhost:8080/api/need`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            const res = await req.json();
            if (res.succes === true) {
                toast.success(res.message);
                fetchNeed();
                handleCancel(setModalAddNeed);
                console.log(modalAddNeed);
            } else toast.error(res.message);
        } catch (error) {
            console.error("Error adding collection:", error.message);
            throw error;
        }
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
            <div className="font-bold text-3xl mx-auto p-10 text-center">
                QUẢN LÍ BỘ SƯU TẬP VÀ NHU CẦU
            </div>
            <div className="mx-5">
                <div className="font-bold text-slate-600 text-2xl mb-5">
                    BỘ SƯU TẬP
                </div>
                {collection ? (
                    <div className="grid gap-4 grid-cols-6">
                        {collection.map((item) => (
                            <CollectionCard
                                key={item.id}
                                value={item}
                                fetchAPICollection={fetchCollection}
                            />
                        ))}
                        <div
                            onClick={() => setModalAddCollection(true)}
                            className="cursor-pointer text-[80px] box-content border-2 hover:border-slate-400 hover:text-slate-400 text-slate-300 border-dashed rounded-2xl text-center flex items-center justify-center"
                        >
                            +
                        </div>
                        <Modal
                            title={
                                <div className="text-2xl font-semibold mb-8">
                                    THÊM BỘ SƯU TẬP
                                </div>
                            }
                            open={modalAddCollection}
                            onCancel={() => handleCancel(setModalAddCollection)}
                            footer={null} // Không hiển thị footer mặc định của modal
                        >
                            <Form
                                form={formCollection}
                                name="add-collection"
                                onFinish={addCollection}
                            >
                                <Form.Item
                                    label="Tên bộ sưu tập mới"
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
                                            handleCancel(setModalAddCollection)
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
            <div className="mx-5 mt-5">
                <div className="font-bold text-slate-600 text-2xl mb-5">
                    NHU CẦU
                </div>
                {need ? (
                    <div className="grid gap-4 grid-cols-6">
                        {need.map((item) => (
                            <NeedCard
                                key={item.id}
                                value={item}
                                fetchAPINeed={fetchNeed}
                            />
                        ))}
                        <div
                            onClick={() => setModalAddNeed(true)}
                            className="cursor-pointer text-[80px] border-2 hover:border-slate-400 hover:text-slate-400 text-slate-300 border-dashed rounded-2xl flex items-center justify-center"
                        >
                            +
                        </div>
                        <Modal
                            title={
                                <div className="text-2xl font-semibold mb-8">
                                    THÊM NHU CẦU
                                </div>
                            }
                            open={modalAddNeed}
                            onCancel={() => handleCancel(setModalAddNeed)}
                            footer={null} // Không hiển thị footer mặc định của modal
                        >
                            <Form
                                form={formNeed}
                                name="add-need"
                                onFinish={addNeed}
                            >
                                <Form.Item
                                    label="Tên nhu cầu mới"
                                    name="NeedName"
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
                                            handleCancel(setModalAddCollection)
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
        </>
    );
};

export default NeedsCollections;
