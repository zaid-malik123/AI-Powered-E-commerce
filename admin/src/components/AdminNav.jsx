// import logo from "../assets/logo.png";

const AdminNav = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">
            FOREVER <span className="text-pink-500">.</span>
          </h1>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>

        <button className="bg-gray-700 text-white px-5 py-2 rounded-full hover:bg-gray-800 transition">
          Logout
        </button>
      </header>
  )
}

export default AdminNav