import { Dropdown, Radio, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RevenueChart = () => {
   const [type, setType] = useState('day');
   const [value, setValue] = useState(new Date().getMonth() + 1)
   const [data, setData] = useState()
   const handleChange = (value) => {
      console.log(`selected ${value}`);
      setValue(value)
   }
   const fetData = async () => {
      try {
         const req = await fetch(`http://localhost:8080/api/admin/sales/${type}/${value}`)
         const res = await req.json()
         if (res.succes) {
            setData(res.sale.map(item => ({
               data: item.Month || item.OrderDate.slice(-2),
               sale: (item.sale || item.totalPrice) * 1000
            })))
         } else {
            console.error('Revenue sales: failed')
         }
      } catch {
         console.error('Promise revenue sales rejected')
      }
   }
   console.log("data", data)
   useEffect(() => {
      if (type === 'day') setValue(new Date().getMonth()+1)
      else setValue(new Date().getFullYear())
   }, [type])
   useEffect(() => {
      fetData()
   }, [value])

   const CustomYAxisTick = ({ x, y, payload }) => {
      return (
         <text x={x} y={y} textAnchor="end" fill="#666" dy={4}>
            {new Intl.NumberFormat().format(payload.value)}
         </text>
      );
   };
   const numberFormatter = (value) => new Intl.NumberFormat().format(value);
   return (
      <div className='my-10 bg-white'>
         <div className='flex gap-5 justify-between mx-10 mb-5'>
            <div>
               <div className='text-slate-500 font-semibold mb-2'>Loại biểu đồ</div>
               <Radio.Group value={type} onChange={(e) => setType(e.target.value)}>
               <Radio.Button value="day">Tháng</Radio.Button>
               <Radio.Button value="month">Năm</Radio.Button>
            </Radio.Group>
            </div>
            
            <div>
               <div className='text-slate-500 font-semibold mb-2'>Thời gian</div>
               {type === 'day' &&
               <Select
                  defaultValue={`${new Date().getMonth() + 1}`}
                  style={{
                     width: 100,
                  }}
                  onChange={handleChange}
                  options={
                     Array.from({ length: new Date().getMonth() + 1 }, (_, i) => ({
                        value: `${i + 1}`,
                        label: `Tháng ${i + 1}`,
                     }))
                  }
               />
            }
            {type === 'month' &&
               <Select
                  defaultValue={`${new Date().getFullYear()}`}
                  style={{
                     width: 120,
                  }}
                  onChange={handleChange}
                  options={
                     Array.from({ length: new Date().getFullYear() - 2022 + 1 }, (_, i) => ({
                        value: `${i + 2022}`,
                        label: `${i + 2022}`,
                     }))
                  }
               />
            }
            </div>
           
         </div>

         {data &&
            <ResponsiveContainer width="100%" height={300}>
               <LineChart
                  width={500}
                  height={200}
                  data={data}
                  margin={{
                     top: 10,
                     right: 20,
                     left: 50,
                     bottom: 0,
                  }}
               >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis tick={<CustomYAxisTick />} ></YAxis>
                  <Tooltip formatter={numberFormatter} />
                  <Line connectNulls type="monotone" dataKey="sale" stroke="#8884d8" fill="#8884d8" />
               </LineChart>
            </ResponsiveContainer>
         }
         <div className='mx-auto w-fit font-semibold text-base uppercase py-5'>BIỂU ĐỒ DOANH THU</div>

      </div>
   );
};

export default RevenueChart;