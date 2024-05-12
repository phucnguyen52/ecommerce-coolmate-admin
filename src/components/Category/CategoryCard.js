import React, { useState } from 'react';
import { ExclamationCircleFilled, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Modal, Form, Input, Button } from 'antd';
const { confirm } = Modal;
const { useForm } = Form;
const CategoryCard = (props) => {
  const { value } = props
  // console.log(value)
  const handleDelete = (id) => {
    confirm({
      title: 'Bạn có chắc chắn xoá loại sản phẩm này?',
      icon: <ExclamationCircleFilled />,
      //   content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        console.log(id);
      },
      onCancel() {
        console.log('Cancel');
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

  const onFinish = (values) => {
    console.log('Received values:', values);
    setVisible(false); // Ẩn modal sau khi submit thành công
  };
  return (
    <>
      <div className='border rounded-2xl p-2 text-center flex flex-col justify-between'>
        <div className='text-2xl font-bold p-4'>{value.Name}</div>
        <div>
          <div className='flex gap-4 justify-center'>
            <button
              className='py-1 px-2 border rounded-md hover:border-slate-500'
              onClick={showModal}
            >
              <EditOutlined /> Sửa
            </button>
            <button
              className='py-1 px-2 border rounded-md hover:border-red-600 text-red-500'
              onClick={() => handleDelete(value.id)}
            >
              <DeleteOutlined /> Xoá
            </button>
          </div>

          <Modal
            title={<div className="text-2xl font-semibold mb-8">CẬP NHẬT LOẠI SẢN PHẨM</div>}
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
                <Input className='bg-black' />
              </Form.Item>
              <Form.Item className='mb-0'>
                <Button type="primary" htmlType="submit" className='mr-4'>
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