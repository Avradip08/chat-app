import { useState } from "react"
import axios from "axios"
import { useSetRecoilState } from "recoil"
import { userAtom } from "../store/user"
import {useNavigate} from 'react-router-dom'

const Signup = () =>{
    const [userName,setUserName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')
    const setUser = useSetRecoilState(userAtom)
    const navigate = useNavigate()
    
    async function handleSubmit(){
        try{
                const res = await axios.post("http://localhost:8080/auth/signup",
                    {
                        userName,email,password
                    }
                )
                const data = res.data
                console.log(data)
                setUser({
                    userName
                })
                localStorage.setItem('token',data.token)
                navigate('/chat')
        }catch(e){
            console.log(error)
        }
        
    }
    return(
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col h-[375px] w-80 bg-slate-50 border border-black rounded-xl font-mono">
                <div>
                    <h1 className="m-2 p-2 text-center font-extrabold text-2xl">
                        Signup
                    </h1>
                </div>
                <div className="flex justify-center">
                    <input value={userName} onChange={(e)=>{
                        setUserName(e.target.value)
                    }} className="border border-black m-2 p-2 rounded-md w-9/12" type="text" placeholder="username" />
                </div>
                <div className="flex justify-center">
                    <input value={email} onChange={(e)=>{
                        setEmail(e.target.value)
                    }} className="border border-black m-2 p-2 rounded-md w-9/12" type="text" placeholder="email" />
                </div>
                <div className="flex justify-center">
                    <input value={password} onChange={(e)=>{
                        setPassword(e.target.value)
                    }} className="border border-black m-2 p-2 rounded-md w-9/12" type="password" placeholder="password" />
                </div>
                <div className="flex justify-center">
                    <input value={confirmPassword} onChange={(e)=>{
                        setConfirmPassword(e.target.value)
                    }} className="border border-black m-2 p-2 rounded-md w-9/12" type="password" placeholder="confirm password" />
                </div>
                <div className="flex justify-center">
                    <button onClick={handleSubmit} className="bg-black text-white m-2 p-2 rounded-lg shadow-lg w-9/12 text-xl font-bold">SUBMIT</button>
                </div>
            </div>
        </div>
    )
}

export default Signup