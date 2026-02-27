import React, { useEffect, useState } from 'react'
import Card from './Card'
import axios from 'axios';

const LatestCollections = () => {

  const [data, setData] = useState([])

  const getLatestCollection = async () => {

    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/product/latest`)

    setData(res.data.products)
  }

  useEffect(() => {
    getLatestCollection()
  }, [])
  
  return (
    <div className="w-full mt-10">
      <div className="flex items-center justify-center flex-col gap-5">
       <div className='flex items-center gap-5'>
           <h1 className="md:text-[40px] text-[30px] font-[400] tracking-[1.2px]">
          Latest <span className="text-gray-500">Collections</span>
        </h1>
        <div className="md:w-30 w-20 h-[1px] bg-gray-700" />
       </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mt-10">
        {data.map((item, idx) => (
          <Card  key={idx} item={item} />
        ))}
      </div>
    </div>
  );
};


export default LatestCollections