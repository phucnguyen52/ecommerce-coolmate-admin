import React, { useEffect, useState } from 'react';



const CustomerVIP = () => {
   const [data, setData] = useState()
   const fetchCustomerVIP = async () => {
      try {
         const req = await fetch('http://localhost:8080/api/admin/sales/user/top')
         const res = await req.json()
         if (res.succes) {
            const order = res.order.sort((a, b) => {
               return Number(b.totalPrice) - Number(a.totalPrice);
           });
            setData(order)
         }
      } catch (error) {
         console.log("Error fetch top top CustomerVIP", error)
      }
   }
   useEffect(() => {
      fetchCustomerVIP()
   }, [])
   return (
      <>
         <div className="relative overflow-x-auto shadow-md rounded-lg">
            <div className='font-semibold text-base uppercase p-3 bg-white'>Khách hàng VIP</div>
            <table className="w-full text-sm text-left ">
               <thead className="text-xs  uppercase bg-gray-100 ">
                  <tr>
                     <th scope="col" className="px-3 py-3 text-center">
                        STT
                     </th>
                     <th scope="col" className="px-3 py-3">
                        Tên khách hàng
                     </th>
                     <th scope="col" className="px-3 py-3  text-center">
                        Số đơn hàng
                     </th>
                     <th scope="col" className="px-3 py-3  text-center">
                        Tổng giá trị
                     </th>
                  </tr>
               </thead>
               {data &&
                  <tbody>
                     {data.map((item, index) => {
                        return (
                           <tr key={index} className="bg-white border-b ">
                              <th className="px-3 py-2 font-medium text-gray-900 text-center">
                                 {index + 1}
                              </th>
                              <td className="px-3 py-2 flex gap-3">
                                 <img className='h-7 w-7 object-cover rounded-full' alt='' src={item.picture}/>
                                 {item.userName}
                              </td>
                              <td className="px-3 py-2  text-center">
                              {item.orders}
                              </td>
                              <td className="px-3 py-2 text-center">
                                 {Number(item.totalPrice).toLocaleString('vi-VN')}.000
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               }
            </table>
         </div>
      </>
   );
};

export default CustomerVIP;