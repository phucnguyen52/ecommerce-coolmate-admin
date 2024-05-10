import React, { useEffect, useState } from 'react';
import '../index.css'
import { Button, Checkbox, Col, Form, Input, InputNumber, Row, Select, Space, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
const { Option } = Select;
const layout = {
   labelCol: {
      span: 8,
   },
   wrapperCol: {
      span: 16,
   },
};
const tailLayout = {
   wrapperCol: { offset: 4, span: 16 },
};
const AddProduct = () => {
   const [form] = Form.useForm();
   const [need, setNeed] = useState()
   const [collection, setCollection] = useState()
   const [categorySub, setCategorySub] = useState()
   const [category, setCategory] = useState()
   const [imageUrl, setImageUrl] = useState([]);
   const [isLoading, setIsLoading] = useState(false)

   const fetchapi = async (type) => {
      const req = await fetch(`http://localhost:8080/api/${type}`)
      const res = await req.json();
      // console.log(res);
      return res
   }
   useEffect(() => {
      const set = async () => {
         setNeed(await fetchapi('need'));
         setCollection(await fetchapi('collection'));
         setCategorySub(await fetchapi('categorysub'));
         setCategory(await fetchapi('category'))
      }
      set()
   }, [])
   // console.log("CategorySubId", category)

   const onFinish = async (values) => {
      const test = values.DescriptionProducts.split('\n').join('\u005C\u005C\u005C\u005C');
      console.log(test)
      if (values.NameNeed) {
         const need = {
            NeedName: values.NameNeed
         }
         try {
            const req = await fetch(`http://localhost:8080/api/need`,
               {
                  method: "POST",
                  headers: {
                     "Content-Type": "application/json"
                  },
                  body: JSON.stringify(need)
               })

            if (!req.ok) {
               throw new Error('Thêm nhu cầu không thành công');
            }
            const res = await req.json();
            if (res.needs.id) values.NeedID.push(res.needs.id)
         } catch (error) {
            console.error('Error adding need:', error.message);
            throw error;
         }
         values.NeedID = values.NeedID.filter(item => item !== 'other')
      }
      if (values.NameCollection) {
         const collection = {
            Name: values.NameCollection
         }
         try {
            const req = await fetch(`http://localhost:8080/api/collection`,
               {
                  method: "POST",
                  headers: {
                     "Content-Type": "application/json"
                  },
                  body: JSON.stringify(collection)
               })

            if (!req.ok) {
               throw new Error('Thêm bộ sưu tập không thành công');
            }
            const res = await req.json();
            if (res.collection.id) values.CollectionID.push(res.collection.id)
         } catch (error) {
            console.error('Error adding collection:', error.message);
            throw error;
         }
         values.NeedID = values.NeedID.filter(item => item !== 'other')
      }
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
      console.log("product", product);

      console.log("values", values);
      try {
         const req = await fetch(`http://localhost:8080/api/products`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json"
               },
               body: JSON.stringify(product)
            })


         const res = await req.json();
         console.log(res)
         if (res.succes === true) {
            toast.success('Thêm sản phẩm thành công')
         }
         else toast.error("Tên sản phẩm đã tồn tại")

      } catch (error) {
         console.error('Error adding product:', error.message);
         throw error;
      }
      onReset()
   };
   const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
   };
   const onReset = () => {
      form.resetFields();
      setImageUrl([]);
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
         setImageUrl([...imageUrl, data[0]]);
      } catch (error) {
         console.error('Error uploading images:', error);
      }

      // Ngăn chặn quá trình tải lên mặc định của Upload
      return false;
   };
   return (
      <>
         <div className='font-bold text-3xl mx-auto p-10 text-center'>THÊM SẢN PHẨM MỚI</div>
         <Form
            labelAlign="left"
            {...layout}
            form={form}
            name="add-product"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{
               'Discount': 0,
            }}
            className='max-w-[800px] bg-[#eff6ff] p-5 rounded-md mx-auto'
         >
            <Form.Item name="NameProducts" label="Tên sản phẩm" rules={[{ required: true, }]}>
               <Input />
            </Form.Item>


            <Form.Item name="DescriptionProducts" label="Mô tả" rules={[{ required: true, }]}>
               <Input.TextArea />
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
                        // console.log(item)
                        return (<Option key={index} value={item.id}>{item.Name}</Option>);
                     })}
                  </Select>
               </Form.Item>
            }
            {/* <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.CategorySubId !== currentValues.CategorySubId}>
               {({ getFieldValue }) => {
                  return getFieldValue('CategorySubId') === 'other' ? (
                     <div className='border border-blue-300 rounded-lg px-5 pt-5 mb-5  bg-[#dbeafe]'>
                        <Form.Item name="NameCategorySub" label="Tên loại sản phẩm mới" rules={[{ required: true, }]}>
                           <Input />
                        </Form.Item>
                        {category && category.category &&
                           <Form.Item name="CategoryId" label="Loại" rules={[{ required: true, }]}>
                              <Select placeholder="Chọn loại" onChange={onGenderChange} allowClear >
                                 {category.category.map((item, index) => {
                                    // console.log(item)
                                    return (<Option key={index} value={item.id}>{item.Name}</Option>);
                                 })}
                                 <Option value={'other'}>Other</Option>
                              </Select>
                           </Form.Item>
                        }
                        <Form.Item
                           noStyle
                           shouldUpdate={(prevValues, currentValues) => prevValues.CategoryId !== currentValues.CategoryId}
                        >
                           {({ getFieldValue }) => {
                              return getFieldValue('CategoryId') === 'other' ? (
                                 <Form.Item name="NameCategory" label="Tên loại mới" rules={[{ required: true, }]}>
                                    <Input />
                                 </Form.Item>
                              ) : null
                           }}
                        </Form.Item>

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
                                    return <div key={item} className="w-[300px] h-[400px] border border-blue-300 p-2 rounded-md"><img src={item} alt="Uploaded" className="w-full h-full object-cover" /></div>
                                 })}
                              </div>

                           </div>
                        )}


                     </div>
                  ) : null
               }}
            </Form.Item> */}


            {need && need.needs &&
               <Form.Item label="Nhu cầu" name="NeedID" rules={[{ required: true, }]}>
                  <Checkbox.Group>
                     <Row>
                        {need.needs.map((item, index) => {
                           // console.log(item)
                           return (
                              <Col span={8} key={index}>
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

            {/* <Form.Item
               noStyle
               shouldUpdate={(prevValues, currentValues) => prevValues.NeedID !== currentValues.NeedID}
            >
               {({ getFieldValue }) => {
                  return getFieldValue('NeedID') ? getFieldValue('NeedID').includes('other') ? (
                     <Form.Item name="NameNeed" label="Tên nhu cầu mới" rules={[{ required: true, }]}>
                        <Input />
                     </Form.Item>
                  ) : null : null
               }}
            </Form.Item> */}

            {collection && collection.collection &&
               <Form.Item label="Bộ sưu tập" name="CollectionID" rules={[{ required: true, }]}>
                  <Checkbox.Group>
                     <Row>
                        {collection.collection.map((item, index) => {
                           // console.log(item)
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

            {/* <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.CollectionID !== currentValues.CollectionID}>
               {({ getFieldValue }) => {
                  return getFieldValue('CollectionID') ? getFieldValue('CollectionID').includes('other') ? (
                     <Form.Item name="NameCollection" label="Tên bộ sưu tập mới" rules={[{ required: true, }]}>
                        <Input />
                     </Form.Item>
                  ) : null : null
               }

               }
            </Form.Item> */}

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
                        return <div key={item} className="w-[300px] h-[400px] border border-blue-300 p-2 rounded-md"><img src={item} alt="Uploaded" className="w-full h-full object-cover" /></div>
                     })}
                  </div>

               </div>
            )}

            <Form.Item {...tailLayout}>
               <div className='flex gap-4'>
                  <Button block size='large' type="primary" htmlType="submit" disabled={isLoading}>
                     Submit
                  </Button>
                  <Button block size='large' htmlType="button" onClick={onReset}>
                     Reset
                  </Button>
               </div>
            </Form.Item>
         </Form>
      </>
   );
}

export default AddProduct;