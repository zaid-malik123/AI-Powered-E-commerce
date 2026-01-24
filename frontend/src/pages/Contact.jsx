import ContactImage from "../assets/Contact.png";
import InputBox from "../components/InputBox";

const Contact = () => {
  return (
    <div className="w-full">

      {/* CONTACT US HEADER */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center gap-4 mb-12 justify-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            CONTACT US
          </h2>
          <div className="w-20 h-[1px] bg-gray-400" />
        </div>

        {/* MAIN CONTENT */}
        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* LEFT IMAGE */}
          <img
            src={ContactImage}
            alt="Contact"
            className="w-full object-cover"
          />

          {/* RIGHT CONTENT */}
          <div className="space-y-8 text-gray-600 text-sm">

            {/* OUR STORE */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">
                OUR STORE
              </h3>
              <p>54709 Willms Station</p>
              <p>Suite 350, Washington, USA</p>
              <p className="mt-4">Tel: (415) 555-0132</p>
              <p>Email: greatstackdev@gmail.com</p>
            </div>

            {/* CAREERS */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">
                CAREERS AT FOREVER
              </h3>
              <p className="mb-4">
                Learn more about our teams and job openings.
              </p>

              <button className="px-6 py-2 border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition">
                Explore Jobs
              </button>
            </div>

          </div>
        </div>
      </section>
      <InputBox/>
    </div>
  );
};

export default Contact;
