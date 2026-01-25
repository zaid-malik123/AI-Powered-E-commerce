import AboutImage from "../assets/About.png"

const About = () => {
  return (
    <div className="w-full min-h-screen">

      {/* ABOUT US SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        {/* Heading */}
        <div className="flex items-center gap-4 mb-10 justify-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            ABOUT US
          </h2>
          <div className="w-20 h-[1px] bg-gray-300" />
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-10 items-start">
          
          {/* Image */}
          <img
            src={AboutImage}// apni image yahan dalna
            alt="About"
            className="w-full h-120 object-cover"
          />

          {/* Text */}
          <div className="text-gray-600 text-sm leading-7 space-y-5">
            <p>
              Forever was born out of a passion for innovation and a desire to
              revolutionize the way people shop online. Our journey began with
              a simple idea: to provide a platform where customers can easily
              discover, explore, and purchase a wide range of products from the
              comfort of their homes.
            </p>

            <p>
              Since our inception, we’ve worked tirelessly to curate a diverse
              selection of high-quality products that cater to every taste and
              preference. From fashion and beauty to electronics and home
              essentials, we offer an extensive collection sourced from trusted
              brands and suppliers.
            </p>

            <h3 className="font-semibold text-gray-800 pt-4">
              Our Mission
            </h3>

            <p>
              Our mission at Forever is to empower customers with choice,
              convenience, and confidence. We’re dedicated to providing a
              seamless shopping experience that exceeds expectations, from
              browsing and ordering to delivery and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        
        <div className="flex items-center gap-4 mb-10">
          <h2 className="text-xl font-semibold text-gray-800">
            WHY CHOOSE US
          </h2>
          <div className="w-20 h-[1px] bg-gray-300" />
        </div>

        <div className="grid md:grid-cols-3 border border-gray-300">

          {/* Box 1 */}
          <div className="px-8 py-10 md:py-25 border-b md:border-b-0 md:border-r border-gray-300">
            <h3 className="font-semibold mb-3">
              QUALITY ASSURANCE:
            </h3>
            <p className="text-sm text-gray-600 leading-6">
              We meticulously select and vet each product to ensure it meets
              our stringent quality standards.
            </p>
          </div>

          {/* Box 2 */}
          <div className="px-8 py-10 md:py-25 border-b md:border-b-0 md:border-r border-gray-300">
            <h3 className="font-semibold mb-3">
              CONVENIENCE:
            </h3>
            <p className="text-sm text-gray-600 leading-6">
              With our user-friendly interface and hassle-free ordering
              process, shopping has never been easier.
            </p>
          </div>

          {/* Box 3 */}
          <div className="px-8 py-10 md:py-25">
            <h3 className="font-semibold mb-3">
              EXCEPTIONAL CUSTOMER SERVICE:
            </h3>
            <p className="text-sm text-gray-600 leading-6">
              Our team of dedicated professionals is here to assist you every
              step of the way, ensuring your satisfaction is our top priority.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default About;
