import './App.css'
import { Outlet, createBrowserRouter } from 'react-router-dom'
import Room from './components/Room'
import Landing from './components/Landing'
import { useEffect } from 'react'
import Login from './components/Login'
import Signup from './components/Signup'
import Navbar from './components/Navbar'
import { RecoilRoot, useSetRecoilState } from 'recoil'
import axios from 'axios'
import { userAtom } from './store/user'
import Home from './components/Home'


function App() {
  return (
      <>
        <RecoilRoot>
        <AuthRoot/>
        <Navbar/>
        <Outlet/>
        </RecoilRoot>
      </>
      
  )
}

const AuthRoot = () => {
  const setUser = useSetRecoilState(userAtom)
  async function getUser(){
    try{
      const res = await axios.get("http://localhost:8080/api/me",{
        headers : {
          Authorization : "Bearer " + localStorage.getItem("token")
        }
      })

      const data = res.data
      setUser({
        userName : data?.user?.userName
      })
    }catch(e){
      console.log(e)
    }
  }
  useEffect(()=>{
      //check if user is logged in
      getUser()
    },
  [])
  return (
    <></>
  )
}

export const AppRouter = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
        path:'/',
        element:<Home/>
      },
      {
        path:'/chat',
        element:<Landing/>
      },
      {
        path:'/room/:type/:id',
        element:<Room/>
      },{
        path:'/login',
        element:<Login/>
      },{
        path: '/signup',
        element : <Signup/>
      }
    ]
  }
])



export default App
