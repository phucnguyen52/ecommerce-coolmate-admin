import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/Product/ProductCard';
import { Input, Spin } from 'antd';
const { Search } = Input;

const ListProduct = () => {
   const [products, setProducts] = useState()
   const [page, setPage] = useState(1)
   const [search, setSearch] = useState()

   const fetProduct = async () => {
      try {
         const req = await fetch(`http://localhost:8080/api/products?min=0&max=1000000&page=${page}&sort=new&type=DESC`)
         const res = await req.json();
         if (res.succes) {
            // console.log(res);
            setProducts(res.product)
            if (page > Math.ceil(res.product.count / 10)) setPage(Math.ceil(res.product.count / 10))
         } else console.log(res.message)

      } catch (error) {
         console.log("Error get list product", error)
      }
   }
   const fetSearchProduct = async (text) => {
      try {
         const req = await fetch(`http://localhost:8080/api/admin/search/product?search=${text}`)
         const res = await req.json();
         if (res.succes) {
            // console.log(res);
            setProducts({
               products: res.product
            })
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
               key={index}
               className={`border py-1 px-4 hover:border-blue-400 hover:text-blue-500 ${page === (index + 1) ? ' border-blue-400 text-blue-500' : ''}`}
               onClick={() => handlePage(index + 1)}
            >
               {index + 1}
            </button>
         ))
      );
   }

   const onSearch = async (value, _e, info) => {
      console.log(value)
      const valueSearch = value.trim()
      if (value !== search) {
         if (valueSearch) {
            setSearch(valueSearch)
            fetSearchProduct(valueSearch)
         } else {
            setSearch()
            setPage(1)
            fetProduct()
         }
      }
   }

   return (
      <>
         <div className='font-bold text-3xl mx-auto my-10 text-center'>QUẢN LÍ SẢN PHẨM</div>
         <div className='my-10 w-4/5 mx-auto'>
            <Search placeholder="Nhập tên sản phẩm" onSearch={onSearch} enterButton />
         </div>
         {products && products.products ?
            products.products.length > 0 ?
               <>
                  <div className='grid grid-cols-5 gap-4 m-10'>
                     {products.products.map(item => {
                        return <ProductCard fetchProduct={fetProduct} key={item.id} value={item} />
                     })}
                  </div>
                  <div className='flex gap-2 mt-[100px] justify-center mb-5'>
                     {products.count && buttonPage(Math.ceil(products.count / 10))}
                  </div>
               </>
               :
               <div className='text-center'>Không tìm thấy sản phẩm</div>
            :
            <div className='text-center mt-10'>
               <Spin size="large" />
            </div>
         }

      </>
   );
};

export default ListProduct;