import {Routes, Route} from "react-router-dom"
import AdminLogin from "../pages/AdminLogin"


const AppRoutes = () => {
  return (
    <div>

        <Routes>

            <Route path="/admin/login" element={<AdminLogin/>}></Route>

        </Routes>
    </div>
  )
}

export default AppRoutes