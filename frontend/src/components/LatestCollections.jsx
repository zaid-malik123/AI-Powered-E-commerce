import React, { useState } from 'react'
import Image1 from "../assets/image1.png"
import Image2 from "../assets/image2.png"
import Image3 from "../assets/image3.png"
import Card from './Card'


const LatestCollections = () => {
  const data = [
    { image: Image1, title: "Women Round Neck Cotton Top", price: 22 },
    { image: Image2, title: "Women Round Neck Cotton Top", price: 25 },
    { image: Image3, title: "Women Round Neck Cotton Top", price: 30 },
    { image: Image1, title: "Women Round Neck Cotton Top", price: 22 },
    { image: Image2, title: "Women Round Neck Cotton Top", price: 25 },
  ];

  return (
    <div className="w-full mt-10">
      <div className="flex items-center justify-center flex-col gap-5">
       <div className='flex items-center gap-5'>
           <h1 className="text-[40px] font-[400] tracking-[1.2px]">
          Latest <span className="text-gray-500">Collections</span>
        </h1>
        <div className="w-30 h-[1px] bg-gray-700" />
       </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mt-10">
        {data.map((item, idx) => (
          <Card key={idx} item={item} />
        ))}
      </div>
    </div>
  );
};


export default LatestCollections