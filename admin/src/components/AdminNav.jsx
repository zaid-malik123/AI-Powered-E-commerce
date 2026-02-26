import logo from "../assets/logo.png";

const AdminNav = () => {
  return (
    <div className="py-5 flex items-center justify-between">

        <div>
            <img className="w-15" src={logo} alt="" />
            <p className="text-sm font-thin text-blue-800">ADMIN PANEL</p>
        </div>

        <button className="px-5 py-1 bg-gray-500 rounded-2xl text-white">LogOut</button>

    </div>
  )
}

export default AdminNav