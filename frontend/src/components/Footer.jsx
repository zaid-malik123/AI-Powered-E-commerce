const Footer = () => {
  return (
    <footer className="w-full bg-white px-6 md:px-20 py-16 mt-20">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Left */}
        <div>
          <h1 className="text-2xl font-semibold mb-4">
            FOREVER<span className="text-pink-400">.</span>
          </h1>
          <p className="text-gray-500 text-sm leading-6 max-w-sm">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>

        {/* Middle */}
        <div>
          <h2 className="text-sm font-semibold mb-4 hidden md:block">COMPANY</h2>
          <ul className="space-y-3 text-sm text-gray-500 flex md:flex-col  gap-3">
            <li className="hover:text-black cursor-pointer">Home</li>
            <li className="hover:text-black cursor-pointer">About us</li>
            <li className="hover:text-black cursor-pointer">Delivery</li>
            <li className="hover:text-black cursor-pointer">Privacy policy</li>
          </ul>
        </div>

        {/* Right */}
        <div>
          <h2 className="text-sm font-semibold mb-4 hidden md:block">GET IN TOUCH</h2>
          <ul className="space-y-3 text-sm text-gray-500 flex gap-3">
            <li>+1-212-456-7890</li>
            <li>greatstackdev@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="my-12 border-t"></div>

      {/* Bottom */}
      <p className="text-center text-[12px] text-gray-500">
        Copyright 2024 © GreatStack.dev - All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
