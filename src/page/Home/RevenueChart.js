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
               sale: (item.sale || item.totalPrice)
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
      if (type === 'day') setValue(new Date().getMonth())
      else setValue(new Date().getFullYear())
   }, [type])
   useEffect(() => {
      fetData()
   }, [value])
   return (
      <div>
         <Radio.Group value={type} onChange={(e) => setType(e.target.value)}>
            <Radio.Button value="day">day</Radio.Button>
            <Radio.Button value="month">month</Radio.Button>
         </Radio.Group>

         {type === 'day' &&
            <Select
               defaultValue={`${new Date().getMonth() + 1}`}
               style={{
                  width: 120,
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
         <div className='mx-auto w-fit font-semibold text-base uppercase py-3'>BIỂU ĐỒ DOANH THU</div>
         {data &&
            <ResponsiveContainer width="80%" height={300} className={'mx-auto'}>
               <LineChart
                  width={600}
                  height={200}
                  data={data}
                  margin={{
                     top: 10,
                     right: 0,
                     left: 0,
                     bottom: 0,
                  }}
               >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip />
                  <Line connectNulls type="monotone" dataKey="sale" stroke="#8884d8" fill="#8884d8" />
               </LineChart>
            </ResponsiveContainer>
         }


      </div>
   );
};

export default RevenueChart;