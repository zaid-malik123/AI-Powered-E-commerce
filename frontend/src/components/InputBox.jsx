const InputBox = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-10 mt-40 md:mt-40  w-full">
      <div>
        <h2 className="text-2xl font-semibold text-center">Subscribe now & get 20% off</h2>
        <p className="text-sm font-[300] text-gray-600 text-center mt-5">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.{" "}
        </p>
      </div>
      <form className="w-full flex items-center justify-center">
        <input
          className="h-10 outline-0 px-5 border border-gray-400 text-[10px] w-full md:w-[40%]"
          type="text"
          placeholder="Enter your email id"
        />
        <button className="h-10 px-5 bg-black text-white text-[10px]">
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default InputBox;
