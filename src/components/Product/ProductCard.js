import React from 'react';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, StarFilled, ExclamationCircleFilled, UploadOutlined, CloseOutlined } from '@ant-design/icons';
import { Modal, Form, Button, UploadButton, Checkbox, Col, Input, InputNumber, Row, Select, Upload } from 'antd';
import { toast } from 'react-toastify';
const { useForm } = Form;
const { confirm } = Modal;
const { Option } = Select;

const layout = {
   labelCol: {
      span: 6,
   },
   wrapperCol: {
      span: 18,
   },
};

const ProductCard = (props) => {
   const { value, fetchProduct } = props
   const [form] = useForm();
   // console.log("Product", value.id, value)
   const [data, setData] = useState()
   const [rating, setRating] = useState()
   const [need, setNeed] = useState()
   const [collection, setCollection] = useState()
   const [categorySub, setCategorySub] = useState()
   const [isLoading, setIsLoading] = useState(false)
   const [visible, setVisible] = useState(false);
   const [imageUrl, setImageUrl] = useState(JSON.parse(value.Image))

   const fetchAPI = async () => {
      try {
         const req = await fetch(`http://localhost:8080/api/products/${value.id}`)
         const res = await req.json()
         if (res.succes) {
            setData(res.product)
            // console.log('res', res)
         } else {
            console.error('ProductDetail: failed')
         }
      } catch {
         console.error('Promise productdetail rejected')
      }
   }
   const fetchapi = async (type) => {
      try {
         const req = await await fetch(`http://localhost:8080/api/${type}`)
         const res = await req.json();
         if (res.succes) {
            return res
            // console.log('res', res)
         } else {
            console.error('fetchapi: failed')
         }
      
      } catch {
         console.error('Promise fetchapi rejected')
      }
   }
   const fetchRating = async () => {
      try {
         const req = await fetch(`http://localhost:8080/api/products/${value.id}/ratings`)
         const res = await req.json()
         if (res.succes) {
            const count = res.rating.count;
            const total = res.rating.totalStartPoint;
            setRating({
               count: count,
               point: count !== 0 ? (total / count).toFixed(2) : 0
            })
         }
         else console.log("Không lấy được biến thể")
      } catch (error) {
         console.log("Error get variantproduct", error)
      }
   }
   useEffect(() => {
      fetchAPI()
      fetchRating()
      const set = async () => {
         setNeed(await fetchapi('need'));
         setCollection(await fetchapi('collection'));
         setCategorySub(await fetchapi('categorysub'));
      }
      set()
   }, [])
   // console.log("data", data)

   const handleDelete = (id) => {
      confirm({
         title: 'Bạn có chắc chắn sản phẩm này?',
         icon: <ExclamationCircleFilled />,
         //   content: 'Some descriptions',
         okText: 'Yes',
         okType: 'danger',
         cancelText: 'No',
         onOk() {
            const deleteData = async () => {
               try {
                  const res = await fetch(`http://localhost:8080/api/products/${value.id}`, {
                     method: 'DELETE',
                     headers: {
                        'Content-Type': 'application/json',
                        // Thêm các headers khác nếu cần
                     },
                  });
                  const req = await res.json();
                  if (req.succes) {
                     toast.success(req.message, {
                        position: "top-right",
                        autoClose: 1000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                     })
                     fetchProduct()
                  } else toast.error("Xoá sản phẩm không thành công", {
                     position: "top-right",
                     autoClose: 1000,
                     hideProgressBar: true,
                     closeOnClick: true,
                     pauseOnHover: true,
                     draggable: true,
                     progress: undefined,
                  })
               } catch (error) {
                  console.error('Error:', error);
                  throw error; // Ném lại lỗi để có thể xử lý ở phía gọi hàm
               }
            };
            deleteData()
         },
         onCancel() {
            console.log('Cancel');
         },
      });
   };

   const showModal = () => {
      setVisible(true);
   };
   const handleCancel = () => {
      setVisible(false);
   };
   const onFinish = async(values) => {
      const product = {
         CategorySubId: values.CategorySubId,
         CollectionID: values.CollectionID,
         DescriptionProducts: values.DescriptionProducts.split('\n').join('\u005C\u005C'),
         Discount: values.Discount,
         NeedID: values.NeedID,
         Price: values.Price,
         NameProducts: values.NameProducts,
         Image: imageUrl
      }
      try {
         const req = await fetch(`http://localhost:8080/api/products/${value.id}`, {
           method: 'PUT',
           headers: {
             'Content-Type': 'application/json',
             // Thêm các headers khác nếu cần
           },
           body: JSON.stringify(product),
         });
         const res = await req.json();
         if (res.succes) {
            handleCancel();
            toast.success(res.message, {
               position: "top-right",
               autoClose: 1000,
               hideProgressBar: true,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
            })
            console.log(true)
         } else  toast.warning('Tên sản phẩm đã tồn tại', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
         })
       } catch (error) {
         console.error('Lỗi put product', error);
       }
      // console.log('Received values:', product, values);
      // setVisible(false); // Ẩn modal sau khi submit thành công
   };

   const DeleteImg = (img) => {
      const image = imageUrl.filter(item => item !== img);
      setImageUrl(image)
   }
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
         setImageUrl([...imageUrl, data[0]]);
      } catch (error) {
         console.error('Error uploading images:', error);
      }

      // Ngăn chặn quá trình tải lên mặc định của Upload
      return false;
   };
   const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
   };
   return (
      <>
         <div className="w-full flex flex-col justify-between shadow-md rounded-md">
            <div >
               <div className="block relative product-img h-[300px] ">
                  <Link to={`/product/${value.id}`}>
                     <img className="rounded-lg relative h-full object-cover w-full" src={JSON.parse(value.Image)[0]} />

                     <img className="rounded-lg hover:opacity-0 absolute top-0 left-0 h-full w-full object-cover" src={JSON.parse(value.Image)[1]} />
                  </Link>

               </div>

               <Link to={`/product/${value.id}`}>
                  <div className=" text-md p-2">{value.NameProducts}</div>
               </Link>

            </div>
            <div className='p-1'>
               {value.Discount ?
                  <div className="flex text-sm">
                     <div className="font-semibold text-[#242424]">{(value.Price * (100 - value.Discount) / 100).toFixed()}.000đ</div>
                     <del className=" text-gray-400 px-3">{value.Price}.000đ</del>
                     <div className="text-red-500">{value.Discount}%</div>
                  </div>
                  :
                  <div className="font-semibold">{(value.Price * (100 - value.Discount) / 100).toFixed()}.000đ</div>
               }
               {rating &&
                  <>
                     {rating.count ?
                        <div className='flex '>
                           <div>{rating.point}</div>
                           <StarFilled className='text-yellow-500 ml-1 mr-3' />
                           <div>({rating.count})</div>
                        </div>
                        :
                        <div className="italic mr-5">Chưa có đánh giá</div>
                     }
                  </>
               }
               <div className='flex justify-evenly mt-3 mb-1'>
                  <button
                     className='py-1 px-2 border rounded-md hover:border-slate-500'
                     onClick={() => showModal()}
                  >
                     <EditOutlined />  Sửa
                  </button>
                  <button
                     onClick={() => handleDelete(value.id)}
                     className='py-1 px-2 border rounded-md hover:border-red-600 text-red-500'
                  >
                     <DeleteOutlined /> Xoá
                  </button>
               </div>
            </div>
            <Modal
               title={<div className="text-2xl font-semibold mb-8">CẬP NHẬT SẢN PHẨM</div>}
               open={visible}
               style={{ top: 50 }}
               onCancel={handleCancel}
               footer={null} // Không hiển thị footer mặc định của modal
               width={1000}
            >
               <Form
                  labelAlign="left"
                  form={form}
                  {...layout}
                  name="update-product"
                  initialValues={data && {
                     CategorySubId: data.CategorySub.id,
                     CollectionID: data.Collections.map(item => item.id),
                     DescriptionProducts: data.DescriptionProducts.replace(/\\\\/g, '\n'),
                     Discount: data.Discount,
                     NeedID: data.Needs.map(item => item.id),
                     Price: data.Price,
                     NameProducts: data.NameProducts,
                     // Image: imageUrl
                  }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
               >
                  <Form.Item name="NameProducts" label="Tên sản phẩm" rules={[{ required: true, }]}>
                     <Input />
                  </Form.Item>


                  <Form.Item name="DescriptionProducts" label="Mô tả" rules={[{ required: true, }]}>
                     <Input.TextArea rows={6} />
                  </Form.Item>

                  <Form.Item label="Giá" name="Price" rules={[{ required: true, }]}>
                     <InputNumber
                        style={{
                           width: '50%',
                        }}
                        suffix=".000 VNĐ"
                     />
                  </Form.Item>

                  <Form.Item label="Giảm giá" name="Discount">
                     <InputNumber
                        style={{
                           width: '50%',
                        }}
                        suffix="%"
                     />
                  </Form.Item>

                  {categorySub && categorySub.data &&
                     <Form.Item name="CategorySubId" label="Loại sản phẩm" rules={[{ required: true, }]}>
                        <Select placeholder="Chọn loại sản phẩm">
                           {categorySub.data.map((item, index) => {
                              return (<Option key={index} value={item.id}>{item.Name}</Option>);
                           })}
                        </Select>
                     </Form.Item>
                  }

                  {need && need.needs &&
                     <Form.Item label="Nhu cầu" name="NeedID" rules={[{ required: true, }]}>
                        <Checkbox.Group className='w-full'>
                           <Row>
                              {need.needs.map((item, index) => {
                                 return (
                                    <Col span={6} key={index}>
                                       <Checkbox value={item.id}
                                          style={{
                                             lineHeight: '32px',
                                          }}
                                       >
                                          {item.NeedName}
                                       </Checkbox>
                                    </Col>
                                 );
                              })}
                           </Row>
                        </Checkbox.Group>
                     </Form.Item>
                  }

                  {collection && collection.collection &&
                     <Form.Item label="Bộ sưu tập" name="CollectionID" rules={[{ required: true, }]}>
                        <Checkbox.Group>
                           <Row>
                              {collection.collection.map((item, index) => {
                                 return (
                                    <Col span={8} key={index}>
                                       <Checkbox
                                          value={item.id}
                                          style={{
                                             lineHeight: '32px',
                                          }}
                                       >
                                          {item.Name}
                                       </Checkbox>
                                    </Col>
                                 );
                              })}
                           </Row>
                        </Checkbox.Group>
                     </Form.Item>
                  }

                  <Form.Item>
                     <Upload
                        beforeUpload={handleBeforeUpload}
                        showUploadList={false} // Ẩn danh sách tệp đã chọn
                     >
                        <Button icon={<UploadOutlined />} loading={isLoading}>Choose File</Button>
                     </Upload>
                  </Form.Item>
                  {imageUrl && (
                     <div>
                        <p>Image URL:</p>
                        <div className="flex gap-4 my-4">
                           {imageUrl.map(item => {
                              return (
                                 <div key={item} className="w-[150px] h-[200px] relative">
                                    <img src={item} alt="Uploaded" className="w-full h-full object-cover rounded-md" />
                                    <div
                                       onClick={() => DeleteImg(item)}
                                       className='absolute top-0 right-1.5 cursor-pointer'
                                    >
                                       <CloseOutlined />
                                    </div>
                                 </div>
                              );
                           })}
                        </div>

                     </div>
                  )}

                  <Form.Item className='mb-0'>
                     <Button type="primary" htmlType="submit" className='mr-4' loading={isLoading}>
                        Cập nhật
                     </Button>
                     <Button onClick={handleCancel}>Cancel</Button>
                  </Form.Item>
               </Form>
            </Modal>
         </div>
      </>
   );
};

export default ProductCard;