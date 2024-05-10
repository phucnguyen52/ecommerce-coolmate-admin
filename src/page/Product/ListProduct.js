import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/Product/ProductCard';

const ListProduct = () => {
   const [products, setProducts] = useState()
   const [page, setPage] = useState(1)

   const fetProduct = async () => {
      try {
         const req = await fetch(`http://localhost:8080/api/products?min=0&max=1000000&size=L&page=${page}`)
         const res = await req.json();
         if (res.succes) {
            console.log(res);
            setProducts(res.product)
         } else console.log(res.message)

      } catch (error) {
         console.log("Error get list product", error)
      }

   }
   useEffect(() => {
      fetProduct()
   }, [page])

   const handlePage = (num) => {
      setPage(num)
   }

   const buttonPage = (num) => {
      return (
         [...Array(num)].map((item, index) => (
            <button 
            className={`border py-1 px-4 hover:border-blue-400 hover:text-blue-500 ${page===(index+1) ? ' border-blue-400 text-blue-500' : ''}`}
            onClick={()=>handlePage(index+1)}
            >
               {index+1}
               </button>
         ))
      );
   }
   // const totalPage = Math.ceil(products.count / products.products.length)
   // console.log("totalPage", totalPage)

   return (
      <>
         <div className='font-bold text-3xl mx-auto p-10 text-center'>QUẢN LÍ SẢN PHẨM</div>
         {products && products.products &&
            <>
               <div className='grid grid-cols-5 gap-4'>
                  {products.products.map(item => {
                     return <ProductCard key={item.id} value={item} />
                  })}
               </div>
               <div className='flex gap-2 mt-[100px]'>
                  {buttonPage(Math.ceil(products.count / 10))}
               </div>
            </>
         }

      </>
   );
};

export default ListProduct;