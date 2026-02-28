import BestSellers from "../components/BestSellers"
import Footer from "../components/Footer"
import Hero from "../components/Hero"
import InputBox from "../components/InputBox"
import LatestCollections from "../components/LatestCollections"
import Nav from "../components/Nav"
import Policy from "../components/Policy"

const Home = () => {
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