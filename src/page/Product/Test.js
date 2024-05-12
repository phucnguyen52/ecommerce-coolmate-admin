import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import { HiArrowRight } from 'react-icons/hi'
import { HiArrowLeft } from 'react-icons/hi'


const Test = () => {
   const [data, setData] = useState()

   useEffect(() => {
      const fetchAPI = async () => {
         try {
            const req = await fetch(`http://localhost:8080/api/products/1`)
            const res = await req.json()
            if (res.succes) {
               setData(res.product)
               console.log('res', res)
            } else {
               console.error('ProductDetail: status failed')
            }
         } catch {
            console.error('Promise productdetail rejected')
         }
      }
      fetchAPI()
   }, [])
   function ButtonNext(props) {
      const { onClick } = props
      return <HiArrowRight onClick={onClick} className="absolute right-7 top-[55%] text-[30px] text-black " />
  }

  function ButtonPrev(props) {
      const { onClick } = props
      return <HiArrowLeft onClick={onClick} className="absolute right-7 top-[45%] z-10 text-[30px] text-gray-300 " />
  }
   const settings = {
      customPaging: function (i) {
          return (
              <a>
                  <img src={`${JSON.parse(data.Image)[i]}`} alt="" />
              </a>
          )
      },
      appendDots: (dots) => (
          <div>
              <ul className="absolute left-[-50px] top-0 flex max-w-[40px] flex-col gap-2"> {dots} </ul>
          </div>
      ),
      dots: true,
      dotsClass: 'slick-thumb',
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <ButtonNext />,
      prevArrow: <ButtonPrev />,
  }
   return (
      <div className=''>
         <div className=" mx-auto max-w-6xl px-4 pt-8">
            <div className="mx-auto md:max-w-4xl">
               {/* <div className="pb-7"><Link>Trang chủ</Link> / <Link className="font-bold">{data.NameCategorySub}</Link> </div> */}
               <div
                  className="relative mx-auto flex flex-col items-center justify-center pb-20  lg:flex-row lg:items-start"
               >
                  <div className="top-5 w-[40%] lg:sticky">
                     {data &&
                        <Slider {...settings} className="w-full">
                           {JSON.parse(data.Image).map((item) => {
                              console.log('img', item)
                              return (
                                 <div key={item} className="w-full">
                                    <img
                                       className="h-full w-full object-cover"
                                       src={`${item}`}
                                       alt=""
                                    />
                                 </div>
                              )
                           })}
                        </Slider>
                     }
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Test;