import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, StarFilled, ExclamationCircleFilled, UploadOutlined, CloseOutlined } from '@ant-design/icons';
import { Modal, Form, Button, UploadButton, Checkbox, Col, Input, InputNumber, Row, Select, Upload, Divider } from 'antd';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie'
import { APP_ROUTER } from '../../utils/Constants'
import '../index.css'
const { Search } = Input;
const { useForm } = Form;
const { Option } = Select;

const layout = {
   labelCol: {
      span: 6,
   },
   wrapperCol: {
      span: 16,
   },
};
const tailLayout = {
   wrapperCol: { offset: 4, span: 16 },
};

const AddStore = () => {
   const nagative = useNavigate();
   const [form] = Form.useForm();
   const [formVariant] = Form.useForm();
   const [product, setProduct] = useState()
   const [modalAddVariant, setModalAddVariant] = useState(false)
   const [modalSearchProduct, setModalSearchProduct] = useState(false)
   const [productId, setProductId] = useState()
   const [addStore, setAddStore] = useState([])
   const sizeDefault = ['S', 'M', 'L', 'XL', '2XL', '3XL']



   const onReset = () => {
      form.resetFields()
      formVariant.resetFields()
      setAddStore([])
   };
   const onFinish = async (values) => {
      const userDataString = Cookies.get('token');
        if (!userDataString) {
            toast.warning("Vui lòng đăng nhập")
            nagative(APP_ROUTER.LOGIN)
            return 0;
        }
      console.log('Received values:', values);
      console.log("post", addStore)
      const data = addStore.map(item => ({
         ProductId: item.ProductId,
         variants: item.variants
      }))
      console.log("data", data)
      if (!addStore.length) return 0
      try {
         const req = await fetch(`http://localhost:8080/api/admin/store`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json"
               },
               credentials: 'include',
               body: JSON.stringify(data)
            })
         const res = await req.json();
         console.log(res)
         if (res.succes === true) {
            toast.success('Tạo nhập thành công')
            onReset()
            handleCancelVariant()
            handleCancelSearch()
         }
         else toast.error("Tạo nhập kho thất bại")

      } catch (error) {
         console.error('Error adding product:', error.message);
         throw error;
      }
   };
   const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
   };






   const showModalVariant = () => {
      setModalAddVariant(true);
   };
   const handleCancelVariant = () => {
      setModalAddVariant(false);
   };
   const addVariant = async (values) => {
      console.log(values)
      if (values.price < 1 || values.price < 1) return 0
      const index = addStore.findIndex(item => item.ProductId === productId.ProductId);

      if (index !== -1) {
         // Nếu productId đã tồn tại, thêm đối tượng mới vào mảng "variants" của đối tượng có productId tương ứng

         setAddStore(prevState => {
            const newState = [...prevState];
            const variantIndex = newState[index].variants.findIndex(variant =>
               variant.color === values.color && variant.size === values.size
            );
            if (variantIndex !== -1) {
               newState[index].variants[variantIndex] = values;
            } else {
               // Nếu variant chưa tồn tại, thêm giá trị mới
               newState[index].variants.push(values);
            }
            return newState;
         });
      } else {
         // Nếu productId không tồn tại, tạo một đối tượng mới và thêm vào mảng A
         setAddStore(prevState => [...prevState, { ...productId, variants: [values] }]);
      }
   };
   // console.log('addStore', addStore)


   const selectProduct = (idProduct, Name) => {
      setProductId({
         ProductId: idProduct,
         Name: Name
      })
      console.log(idProduct)
      showModalVariant()
   }





   const showModalSearchProduct = () => {
      setModalSearchProduct(true);
   };
   const handleCancelSearch = () => {
      setModalSearchProduct(false);
   };
   const onSearch = async (value, _e, info) => {
      if (!value.trim()) return 0
      try {
         const req = await fetch(`http://localhost:8080/api/admin/search/product?search=${value.trim()}`)
         const res = await req.json()
         if (res.succes) {
            // setData(res.product)
            console.log('res', res)
            setProduct(res.product)
         } else {
            console.error('ProductDetail: failed')
         }
      } catch {
         console.error('Promise productdetail rejected')
      }
   }





   return (
      <div className='m-10 bg-slate-100 p-4'>
         <div className='text-2xl font-semibold text-center my-10'>TẠO PHIẾU NHẬP KHO</div>
         <Form
            labelAlign="left"
            form={form}
            {...layout}
            name="add-store"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
         >
            <Form.Item name="NameProvider" label="Tên nhà cung cấp"
            // rules={[{ required: true, }]}
            >
               <Input />
            </Form.Item>
            <Form.Item name="NumberPhone" label="Số điện thoại"
            // rules={[{ required: true, }]}
            >
               <InputNumber />
            </Form.Item>
            <Form.Item name="Address" label="Địa chỉ"
            //  rules={[{ required: true, }]}
            >
               <Input />
            </Form.Item>

            <table className="w-full text-base text-left rtl:text-right text-gray-500">
               <thead className="text-xs uppercase bg-blue-600 text-white">
                  <tr>
                     <th className='p-3 border border-white text-center'>STT</th>
                     <th className='p-3 border border-white text-center'>Mã sp</th>
                     <th className='p-3 border border-white text-center'>Tên sản phẩm</th>
                     <th className='p-3 border border-white text-center'>Màu</th>
                     <th className='p-3 border border-white text-center'>Size</th>
                     <th className='p-3 border border-white text-center'>Số lượng</th>
                     <th className='p-3 border border-white text-center'>Giá</th>
                  </tr>
               </thead>
               <tbody>
                  {addStore.length > 0 && addStore.map((item, index) =>  (
                     item.variants.map((variant, i) =>(
                           <tr className='text-black bg-white' key={index-i}>
                              {i === 0 && (
                                 <>
                                    <td className='align-top p-2 text-center border' rowSpan={item.variants.length}>{index + 1}</td>
                                    <td className='align-top p-2 text-center border' rowSpan={item.variants.length}>{item.ProductId}</td>
                                    <td className='align-top p-2 border' rowSpan={item.variants.length}>{item.Name}</td>
                                 </>
                              )}

                                 <td className='p-2 text-center border'>{variant.color}</td>
                                 <td className='p-2 text-center border'>{variant.size}</td>
                                 <td className='p-2 text-center border'>{variant.quantity}</td>
                                 <td className='p-2 text-center border'>{variant.price}.000VND</td>
                           </tr>
                        ))
                  ))}
                  <tr className='bg-white'>
                     <td colSpan={7} className='p-0'>
                        <div onClick={() => showModalSearchProduct()} className='border hover:border-blue-500 hover:text-blue-500 w-full p-1 text-center cursor-pointer'>
                           + Thêm
                        </div>
                     </td>
                  </tr>
               </tbody>

            </table>

            <Form.Item {...tailLayout} className='text-center mt-20'>
               <Button type="primary" htmlType="submit" className='mr-10'>
                  Tạo phiếu nhập
               </Button>
               <Button onClick={onReset}>Đặt lại</Button>
            </Form.Item>
         </Form>
         <Modal
            title={<div className="text-2xl font-semibold mb-8">CHỌN SẢN PHẨM</div>}
            open={modalSearchProduct}
            onCancel={() => handleCancelSearch()}
            footer={null} // Không hiển thị footer mặc định của modal
         >
            <Search className='mb-4' placeholder="Nhập tên sản phẩm" onSearch={onSearch} enterButton />
            {product &&
               <div>
                  {product.map((item, index) => {
                     return (
                        <div
                           key={index}
                           onClick={() => selectProduct(item.id, item.NameProducts)}
                           className='bg-slate-100 py-1 px-3 m-1 rounded-md hover:border hover:font-semibold cursor-pointer'
                        >
                           {item.NameProducts}
                        </div>
                     );
                  })}
               </div>
            }
         </Modal>

         <Modal
            title={<div className="text-2xl font-semibold mb-8">THÊM BIẾN THỂ SẢN PHẨM</div>}
            open={modalAddVariant}
            onCancel={() => handleCancelVariant()}
            footer={null} // Không hiển thị footer mặc định của modal
         >
            <Form
               form={formVariant}
               name="variantProduct"
               onFinish={addVariant}
            >
               <Form.Item
                  label="Màu"
                  name="color"
                  rules={[{ required: true }]}
               >
                  <Input />
               </Form.Item>
               <Form.Item
                  label="Size"
                  name="size"
                  rules={[{ required: true }]}
               >
                  <Select placeholder="Chọn size">
                     {sizeDefault.map((item) => {
                        // console.log(item)
                        return (<Option key={item} value={item}>{item}</Option>);
                     })}
                     <Option value=' '>Không có</Option>
                  </Select>
               </Form.Item>
               <Form.Item
                  label="Số lượng"
                  name="quantity"
                  rules={[{ required: true }]}
               >
                  <InputNumber min={1} />
               </Form.Item>
               <Form.Item
                  label="Giá"
                  name="price"
                  rules={[{ required: true }]}
               >
                  <InputNumber
                     style={{
                        width: '50%',
                     }}
                     suffix=".000 VNĐ"
                  />
               </Form.Item>
               <Form.Item className='mb-0'>
                  <Button type="primary" htmlType="submit" className='mr-4'>
                     Thêm
                  </Button>
                  <Button onClick={() => handleCancelVariant()}>Huỷ</Button>
               </Form.Item>
            </Form>
         </Modal>
      </div>
   );
};

export default AddStore;