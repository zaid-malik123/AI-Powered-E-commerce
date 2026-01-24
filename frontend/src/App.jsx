import Footer from "./components/Footer"
import Nav from "./components/Nav"
import AIChat from "./components/AIChat"
import useGetCurrentUser from "./hooks/useGetCurrentUser"
import AppRoutes from "./routes/AppRoutes"
const App = () => {
  useGetCurrentUser()
  return (
    <div className='w-screen min-h-screen md:px-25 px-5'>
        <Nav/>
        <AppRoutes/>
        <Footer/>
        <AIChat/>
    </div>
  )
}

export default App