import { RiExchangeFundsLine } from "react-icons/ri";
import { BsCoin } from "react-icons/bs";
import { SlEarphones } from "react-icons/sl";

const Policy = () => {
  return (
    <div className="flex flex-col md:flex-row w-full px-10 justify-center items-center gap-20 md:gap-40 mt-10 md:mt-20">

        <div className="flex flex-col items-center justify-center gap-5">
            <RiExchangeFundsLine className="text-gray-600" size={40} />
            <h3 className="text-md font-bold">Easy Exchange Policy</h3>
            <p className="text-sm text-gray-600">We offer hassle free exchange policy</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-5">
            <BsCoin className="text-gray-600" size={40} />
            <h3 className="text-md font-bold">7 Days Return Policy</h3>
            <p className="text-sm text-gray-600">We provide 7 days free return policy</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-5">
            <SlEarphones className="text-gray-600" size={40} />
            <h3 className="text-md font-bold">Best customer support</h3>
            <p className="text-sm text-gray-600">we provide 24/7 customer support</p>
        </div>
    </div>
  )
}

export default Policy