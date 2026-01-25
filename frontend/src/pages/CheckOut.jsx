const CheckOut = () => {
  return (
    <div className="min-h-screen w-full mt-10">
      <div className="flex items-center gap-3">
        <h1 className="md:text-3xl text-xl text-gray-500 font-mono">
          DELIVERY <span className="font-bold text-black">INFORMATION</span>
        </h1>
        <div className="w-[50px] h-[2px] bg-black"></div>
      </div>

      <div className="w-full md:w-[90%] grid grid-cols-1 md:grid-cols-2 gap-20">
        <form className="w-full flex gap-5 flex-col mt-10">
          <div className="w-full flex gap-2">
            <input
              className="w-1/2 border border-gray-300 outline-0 px-3 py-2 rounded-md placeholder:text-gray-400 text-gray-600"
              type="text"
              placeholder="Fist Name"
            />
            <input
              className="w-1/2 border border-gray-300 outline-0 px-3 py-2 rounded-md placeholder:text-gray-400 text-gray-600"
              type="text"
              placeholder="Last Name"
            />
          </div>
          <div>
            <input
              className="w-full border border-gray-300 outline-0 px-3 py-2 rounded-md placeholder:text-gray-400 text-gray-600"
              type="text"
              placeholder="Email address"
            />
          </div>
          <div>
            <input
              className="w-full border border-gray-300 outline-0 px-3 py-2 rounded-md placeholder:text-gray-400 text-gray-600"
              type="text"
              placeholder="Street"
            />
          </div>
          <div className="w-full flex gap-2">
            <input
              className="w-1/2 border border-gray-300 outline-0 px-3 py-2 rounded-md placeholder:text-gray-400 text-gray-600"
              type="text"
              placeholder="City"
            />
            <input
              className="w-1/2 border border-gray-300 outline-0 px-3 py-2 rounded-md placeholder:text-gray-400 text-gray-600"
              type="text"
              placeholder="State"
            />
          </div>
          <div className="w-full flex gap-2">
            <input
              className="w-1/2 border border-gray-300 outline-0 px-3 py-2 rounded-md placeholder:text-gray-400 text-gray-600"
              type="text"
              placeholder="Zipcode"
            />
            <input
              className="w-1/2 border border-gray-300 outline-0 px-3 py-2 rounded-md placeholder:text-gray-400 text-gray-600"
              type="text"
              placeholder="Country"
            />
          </div>
          <div>
            <input
              className="w-full border border-gray-300 outline-0 px-3 py-2 rounded-md placeholder:text-gray-400 text-gray-600"
              type="text"
              placeholder="Phone"
            />
          </div>
        </form>

        <div className="mt-5">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl text-gray-500 font-mono">
              CART <span className="font-bold text-gray-600">TOTALS</span>
            </h1>
            <div className="w-[50px] h-[2px] bg-black"></div>
          </div>

          <div className="flex justify-between items-center mt-5">
            <div className="text-sm text-gray-500">Subtotal</div>
            <div className="text-md font-bold text-black mb-2">$ 89.00</div>
          </div>
          <hr className="text-gray-300" />
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-gray-500">Subtotal</div>
            <div className="text-md font-bold text-black mb-2">$ 89.00</div>
          </div>
          <hr className="text-gray-300" />
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-md font-bold text-black mb-2">$ 89.00</div>
          </div>

          <div className="mt-10">
            <div className="flex items-center gap-3">
              <h1 className="text-md text-gray-500 font-mono">
                PAYMENT <span className="font-bold text-gray-600">METHOD</span>
              </h1>
              <div className="w-[50px] h-[2px] bg-black"></div>
            </div>

            <div className="flex gap-5 mt-5">
              <button className="px-5 py-2 border border-gray-300 text-gray-600 rounded-md">
                ONLINE
              </button>
              <button className="px-5 py-2 border border-gray-300 text-gray-600 rounded-md">
                CASH
              </button>
            </div>
            <div className="flex justify-end mt-3">
              <button className="px-8 py-3 bg-black text-white">
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
