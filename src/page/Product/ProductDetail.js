import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
// import './ProductDetail.css'
import ProductReviews from '../../components/Product/ProductReviews'
import StarRating from '../../components/Product/StarRating'
import { useParams } from 'react-router-dom'
import { HiArrowRight } from 'react-icons/hi'
import { HiArrowLeft } from 'react-icons/hi'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Table } from 'antd'

const ProductDetail = () => {
    const { id } = useParams()
    const [data, setData] = useState()
    const [rating, setRating] = useState()
    const sizeDefault = ['S', 'M', 'L', 'XL', '2XL', '3XL']

    const fetchRating = async () => {
        try {
            const req = await fetch(`http://localhost:8080/api/products/${id}/ratings`)
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
    const fetchAPI = async () => {
        try {
            const req = await fetch(`http://localhost:8080/api/products/${id}`)
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
    useEffect(() => {
        fetchAPI()
        // fetchRating()
    }, [])

    const checkSize = (variant) => {
        const check = (variant.filter(item => item.size.trim() !== '')).length
        return check ? true : false
    }

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

    const handleRating = (value) => {
        setRating(value)
    }
    return (
        <>
            {data && (
                <>
                    <div className="relative mx-auto flex pl-14 my-4">
                        <div className="w-[35%] top-5 sticky">
                            <Slider {...settings} className="w-full">
                                {JSON.parse(data.Image).map((item) => {
                                    // console.log('img', item)
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
                        </div>
                        <div className="w-[65%] px-8">
                            <div className="text-4xl font-bold">{data.NameProducts}</div>
                            <div className="my-8 flex items-end gap-2">
                                {rating &&
                                    <>
                                        {rating.count ?
                                            <>
                                                <div className='font-bold'>{rating.point}</div>
                                                <StarRating className="text-4xl" css="text-blue-800 w-5 h-5" rating={rating.point} />
                                                <div>({rating.count})</div>
                                            </>
                                            :
                                            <div className="italic mr-5">Chưa có đánh giá</div>
                                        }
                                    </>
                                }
                                <div>| Đã bán (web): {data.QuantitySell}</div>
                            </div>
                            <div className="mb-5 flex gap-2 font-bold">
                                <div className="text-2xl">
                                    {(data.Price - data.Price * data.Discount * 0.01).toFixed()}.000đ
                                </div>
                                <div className="text-2xl text-gray-400">
                                    <del>{data.Price}.000đ</del>
                                </div>
                                <div className="text-xl text-red-600">-{data.Discount}%</div>
                            </div>

                            <div className='my-4'>
                                <div className='font-bold underline mb-4 text-lg'>Số lượng trong kho:</div>
                                <Table
                                    pagination={false}
                                    columns={checkSize(data.VariantProducts)
                                        ?
                                        [{
                                            title: 'Màu/Size',
                                            dataIndex: 'color',
                                            rowScope: 'row',
                                            key: 'color'
                                        },
                                        ...sizeDefault.map((item) => ({
                                            title: item,
                                            dataIndex: item,
                                            key: item
                                        }))]
                                        :
                                        [{
                                            title: 'Màu',
                                            dataIndex: 'color',
                                            rowScope: 'row',
                                            key: 'color'
                                        },
                                        {
                                            title: 'Số lượng',
                                            dataIndex: 'quantity',
                                            key: 'quantity'
                                        }]
                                    }
                                    dataSource={data && (checkSize(data.VariantProducts)?[...new Set(data.VariantProducts.map((item) => item.color))].map((item, index) => ({
                                        key: index,
                                        color: item,
                                        ...sizeDefault.reduce((acc, i) => {
                                                const variant = data.VariantProducts.filter(a => a.color === item && a.size === i)
                                                acc[i] = variant.length ? variant[0].quantity : '-'
                                                return acc;
                                            }, {}) 
                                       
                                    }))
                                : data.VariantProducts.map((item, index)=>({
                                    key: index,
                                    color: item.color,
                                    quantity: item.quantity
                                }))
                            )}
                                />
                            </div>

                            <div className="border-t">
                                <div className="py-4 font-bold">Đặc điểm nổi bật</div>
                                <div>
                                    {data.DescriptionProducts.split(/\\\\/).map((item, index) => (
                                        <div key={index} className="my-2 flex gap-3 italic">
                                            <b>+</b>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>


                    <ProductReviews id={id} onHandleRating={handleRating} />
                </>
            )}
        </>
    );
};

export default ProductDetail;