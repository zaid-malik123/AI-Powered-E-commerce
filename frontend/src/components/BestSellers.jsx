import Card from "./Card";
import Image1 from "../assets/image1.png"
import Image2 from "../assets/image2.png"
import Image3 from "../assets/image3.png"

const BestSellers = () => {
  const data = [
      { image: Image1, title: "Women Round Neck Cotton Top", price: 22 },
      { image: Image2, title: "Women Round Neck Cotton Top", price: 25 },
      { image: Image3, title: "Women Round Neck Cotton Top", price: 30 },
      { image: Image1, title: "Women Round Neck Cotton Top", price: 22 },
      { image: Image2, title: "Women Round Neck Cotton Top", price: 25 },
    ];  
  return (
    <div className="w-full mt-8">
      <div className="flex items-center justify-center flex-col gap-5">
        <h1 className="text-[40px] font-[400] tracking-[1.2px]">
          Best <span className="text-gray-500">Sellers</span>
        </h1>
        <span className="text-sm font-[200]">
          New arrivals that redefine everyday fashion.
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mt-10">
        {data.map((item, idx) => (
          <Card key={idx} item={item} />
        ))}
      </div>
    </div>
  )
}

export default BestSellers