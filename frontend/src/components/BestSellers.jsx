import Card from "./Card";
import axios from "axios"
import { useEffect, useState } from "react";

const BestSellers = () => {
  const [data, setData] = useState([])


  const getBestSellersProduct = async () => {

    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/product/best`)

    setData(res.data.products) 

  }

  useEffect(() => {
    getBestSellersProduct()
  }, [])
  return (
    <div className="w-full mt-8">
      <div className="flex items-center justify-center gap-5 font-serif">
        <h1 className="md:text-[40px] text-[30px] font-[400] tracking-[1.2px]">
          Best <span className="text-gray-500">Sellers</span>
        </h1>
        <div className="md:w-30 w-20 h-[1px] bg-gray-700" />
       
      </div>
       <p className="text-gray-500 text-sm md:text-md text-center font-mono mt-2">
  Discover our newest arrivals crafted with style and comfort in mind.
</p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mt-10">
        {data.map((item, idx) => (
          <Card key={idx} item={item} />
        ))}
      </div>
    </div>
  );
};

export default BestSellers;
