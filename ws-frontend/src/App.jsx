import './App.css'
import { Outlet, createBrowserRouter } from 'react-router-dom'
import Room from './components/Room'
import Landing from './components/Landing'
import { useEffect } from 'react'
import Login from './components/Login'
import Signup from './components/Signup'
import Navbar from './components/Navbar'
import { RecoilRoot, useRecoilValue, useSetRecoilState } from 'recoil'
import axios from 'axios'
import { userAtom } from './store/user'
import Home from './components/Home'
import { API_URL } from './utils/constants'
import {toast,ToastContainer} from "react-toastify"
import { errorAtom } from './store/error'
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
      <>
        <RecoilRoot>
        <AuthRoot/>
        <Navbar/>
        <ToastElement/>
        <Outlet/>
        </RecoilRoot>
      </>
      
  )
}

const AuthRoot = () => {
  const setUser = useSetRecoilState(userAtom)
  async function getUser(){
    try{
      const res = await axios.get(`${API_URL}/me`,{
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

const ToastElement = ()=>{
  const error = useRecoilValue(errorAtom)
  useEffect(()=>{
    toast.error(error,{
      position:'top-center',
      autoClose:2000
    })
  },[error])
  return (
    <ToastContainer/>
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
