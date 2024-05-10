import React from "react";
import  { useState,useRef  } from 'react';
import { Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
// import ImgCrop from 'antd-img-crop';
function ProductPage() {
    const [imageUrl, setImageUrl] = useState([]);

    const handleBeforeUpload = async(file) => {
      const formData = new FormData();
      formData.append('images', file);
  
      // Gửi yêu cầu POST đến API
      try {
        const response = await fetch('http://localhost:8080/upload', {
          method: 'POST',
          body: formData
        });
  
        const data = await response.json();
        setImageUrl([...imageUrl,data]);
      } catch (error) {
        console.error('Error uploading images:', error);
      }
  
      // Ngăn chặn quá trình tải lên mặc định của Upload
      return false;
    };
  
    return (
        <> <div>
        <h2>Upload Image</h2>
        <Upload
          beforeUpload={handleBeforeUpload}
          showUploadList={false} // Ẩn danh sách tệp đã chọn
        >
          <Button icon={<UploadOutlined />}>Choose File</Button>
        </Upload>
        {imageUrl && (
          <div>
            <p>Image URL:</p>
            <div className="flex gap-4">
            {imageUrl.map(item =>{
                return <div className="w-[150px] h-[200px] border border-blue-300 p-2 rounded-md"><img src={item} alt="Uploaded" className="w-full h-full object-cover" /></div>
            })}
            </div>
            
          </div>
        )}
      </div>
        </>
    );
}

export default ProductPage;
