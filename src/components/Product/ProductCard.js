import React from 'react';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import StarRating from './StarRating';
import {
   DeleteOutlined,
   EditOutlined,
   StarFilled
} from '@ant-design/icons';

const ProductCard = (props) => {
   const { value } = props
   console.log("Product", value.id, value)
   const [variant, setVariant] = useState();
   const [rating, setRating] = useState()
   const images = JSON.parse(value.Image);
   const [color, setColor] = useState();
   const checkSize = (variant) => {
      const check = (variant.filter(item => item.size !== '1')).length
      return check ? true : false
   }
   const fetchVariant = async () => {
      try {
         const req = await fetch(`http://localhost:8080/api/products/${value.id}/variant`)
         const res = await req.json()
         if (res.succes) {
            setVariant(res.product)
            setColor(res.product[0].color);
         }
         else console.log("Không lấy được biến thể")
      } catch (error) {
         console.log("Error get variantproduct", error)
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
      fetchVariant()
      fetchRating()
   }, [])
   return (
      <>
         <div className="w-full flex flex-col justify-between shadow-md rounded-md">
            <div >
               <div className="block relative product-img h-[300px] ">
                  <Link to={`/product/${value.id}`}>
                     <img className="rounded-lg relative h-full object-cover w-full" src={images[0]} />

                     <img className="rounded-lg hover:opacity-0 absolute top-0 left-0 h-full w-full object-cover" src={images[1]} />
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
               <div>Đã bán: {value.QuantitySell}</div>
               {variant && <div>Còn lại: {variant.reduce((accumulator, currentValue) => accumulator + currentValue.quantity, 0)}</div>}
               <div className='flex justify-evenly'>
                  <button className='py-1 px-2 border rounded-md hover:border-slate-500'><EditOutlined />  Sửa</button>
                  <button className='py-1 px-2 border rounded-md hover:border-red-600 text-red-500'><DeleteOutlined /> Xoá</button>
               </div>
            </div>

         </div>
      </>
   );
};

export default ProductCard;