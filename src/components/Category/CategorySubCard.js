import React, { useState } from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal, Form, Input, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;
const { useForm } = Form;
const CategorySubCard = (props) => {
   const { value } = props
   const [isLoading, setIsLoading] = useState(false)
   // console.log(value)
   const handleDelete = (id) => {
      confirm({
         title: 'Bạn có chắc chắn xoá chi tiết loại sản phẩm này?',
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
   const [imageUrl, setImageUrl] = useState(value.Image)
   const showModal = () => {
      setVisible(true);
   };
   const handleCancel = () => {
      setVisible(false);
   };
   const onFinish = (values) => {
      const data={
         ...value,
         Image: imageUrl
      }
      console.log('Received values:', values);
      setVisible(false); // Ẩn modal sau khi submit thành công
   };
   const handleBeforeUpload = async (file) => {
      const formData = new FormData();
      formData.append('images', file);

      // Gửi yêu cầu POST đến API
      try {
         setIsLoading(true);
         const response = await fetch('http://localhost:8080/upload', {
            method: 'POST',
            body: formData
         });

         const data = await response.json();
         if (data) setIsLoading(false)
         setImageUrl(data[0]);
      } catch (error) {
         console.error('Error uploading images:', error);
      }

      // Ngăn chặn quá trình tải lên mặc định của Upload
      return false;
   };


   return (
      <>
         <div className='border rounded-2xl p-2 text-center flex flex-col justify-between'>
            <img className='w-full h-[350px] object-cover' src={value.Image} alt="" />
            <div className='text-xl font-bold p-4'>{value.Name}</div>
            <div>
               <button
                  className='bg-blue-400 text-white border rounded-md p-1 mr-4 font-semibold min-w-16'
                  onClick={showModal}
               >
                  Sửa
               </button>
               <button
                  className='bg-red-400 text-white border rounded-md p-1 font-semibold min-w-16'
                  onClick={() => handleDelete(value.id)}
               >
                  Xoá
               </button>
               <Modal
                  title={<div className="text-2xl font-semibold mb-8">CẬP NHẬT LOẠI SẢN PHẨM</div>}
                  visible={visible}
                  onCancel={handleCancel}
                  footer={null} // Không hiển thị footer mặc định của modal
               >
                  <Form
                     form={form}
                     name="update-categorysub"
                     initialValues={{ Name: value.Name }}
                     onFinish={onFinish}
                  >
                     <Form.Item
                        label="Tên chi tiết loại sản phẩm mới"
                        name="Name"
                        rules={[{ required: true }]}
                     >
                        <Input />
                     </Form.Item>
                     <Form.Item label="Ảnh">
                        <Upload
                           beforeUpload={handleBeforeUpload}
                           showUploadList={false} // Ẩn danh sách tệp đã chọn
                           className='flex'
                        >
                           <Button className='mb-4' icon={<UploadOutlined />} loading={isLoading}>Choose File Other</Button>
                           {imageUrl && (
                              <img src={imageUrl} alt="Uploaded" className="w-[150px] h-[200px] object-cover rounded-md" />
                           )}
                        </Upload>

                     </Form.Item>
                     <Form.Item className='mb-0'>
                        <Button type="primary" htmlType="submit" className='mr-4' loading={isLoading}>
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