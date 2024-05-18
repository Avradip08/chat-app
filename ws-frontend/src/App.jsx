import './App.css'
import { Outlet, createBrowserRouter } from 'react-router-dom'
import Room from './components/Room'
import Landing from './components/Landing'
import { useState } from 'react'


function App() {

  const [messages,setMessages] = useState([])
  

  return (
      
      <Outlet messages={messages} setMessages={setMessages}/>
  )
}

export const AppRouter = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
        path:'/',
        element:<Landing/>
      },
      {
        path:'/room/:type/:id',
        element:<Room/>
      }
    ]
  }
])



export default App
