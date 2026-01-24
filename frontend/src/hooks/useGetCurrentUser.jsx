import { useEffect } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setUser } from "../redux/features/userSlice"

const useGetCurrentUser = () => {
  const dispatch =  useDispatch()
  useEffect(() => {
    const fetchUser = async () => {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/currUser`, {withCredentials: true})
        dispatch(setUser(res.data))
    }
    fetchUser()
  }, [])  
}

export default useGetCurrentUser