import BestSellers from "../components/BestSellers"
import Footer from "../components/Footer"
import Hero from "../components/Hero"
import InputBox from "../components/InputBox"
import LatestCollections from "../components/LatestCollections"
import Nav from "../components/Nav"
import Policy from "../components/Policy"
import { useSelector } from "react-redux"

const Home = () => {
  const { user } = useSelector(state => state.userSlice)
  return (
    <div>
       
        <Hero/>
        <LatestCollections/>
        <BestSellers/>
        <Policy/>
        <InputBox/>
    </div>
  )
}

export default Home