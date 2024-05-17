import React, { useEffect, useState } from 'react';

const ProductRow = (props) => {
   const [product, setProduct] = useState()
   const { value, index } = props
   const fetProduct = async () => {
      try {
         const req = await fetch(`http://localhost:8080/api/products/${value.id}`)
         const res = await req.json()
         if (res.succes) {
            setProduct(res.product)
         } else {
            console.error('ProductDetail: failed')
         }
      } catch {
         console.error('Promise productdetail rejected')
      }
   }
   useEffect(() => {
      fetProduct()
   }, [])
   return (
      <>
         {product &&
            <tr className="bg-white border-b ">
               <th className="px-3 py-2 font-medium text-gray-900 text-center">
                  #{index + 1}
               </th>
               <td className="px-3 py-2  ">
                  {product.NameProducts}
               </td>
               <td className="px-3 py-2 text-center">
                  <b>{product.Price}.000</b>
                  <br />
                  <i><del>{Math.ceil(product.Price * (100 - product.Discount) / 100)}.000</del></i>
               </td>
               <td className="px-3 py-2 text-red-600 text-center">
                  -{product.Discount}%
               </td>
               <td className="px-3 py-2 text-center">
                  {value.quantity}
               </td>
            </tr>
         }
      </>
   );
}

const SaleProduct = () => {
   const [data, setData] = useState()
   const fetchSaleProduct = async () => {
      try {
         const req = await fetch('http://localhost:8080/api/admin/order/selling/top')
         const res = await req.json()
         if (res.succes) {
            setData(res.order)
         }
      } catch (error) {
         console.log("Error fetch top top SaleProduct", error)
      }
   }
   useEffect(() => {
      fetchSaleProduct()
   }, [])
   return (
      <>
         <div className="relative overflow-x-auto shadow-md rounded-lg h-fit">
            <div className='font-semibold text-base uppercase p-3 bg-white'>Sản phẩm bán chạy trong tháng</div>
            <table className="w-full text-sm text-left ">
               <thead className="text-xs  uppercase bg-gray-100 ">
                  <tr>
                     <th scope="col" className="px-3 py-3 text-center">

                     </th>
                     <th scope="col" colSpan={3} className="px-3 py-3">
                        Chi tiết sản phẩm
                     </th>
                     <th scope="col" className="px-3 py-3  text-center">
                        Số lượng
                     </th>
                  </tr>
               </thead>
               {data &&
                  <tbody>
                     {data.map((item, index) => {
                        return <ProductRow key={index} value={item} index={index} />
                     })}
                  </tbody>
               }
            </table>
         </div>
      </>

   );
};

export default SaleProduct;