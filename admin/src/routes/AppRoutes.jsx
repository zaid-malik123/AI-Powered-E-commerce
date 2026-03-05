import {Routes, Route} from "react-router-dom"
import AdminLogin from "../pages/AdminLogin"
import  AdminDashBoard  from "../pages/AdminDashBoard"


const AppRoutes = () => {
  return (
    <div>

        <Routes>

            <Route path="/login" element={<AdminLogin/>}></Route>

            <Route path="/" element={<AdminDashBoard/>}></Route>

        </Routes>
    </div>
  )
}

export default AppRoutes