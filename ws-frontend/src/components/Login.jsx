import { useState } from "react"
import axios from "axios"
import { useSetRecoilState } from "recoil"
import { userAtom } from "../store/user"
import { useNavigate } from "react-router"

const Login = () =>{
    const [userName,setUserName] = useState('')
    const [password,setPassword] = useState('')
    const setUser = useSetRecoilState(userAtom)
    const navigate = useNavigate()
    async function handleSubmit(){
        try{
            const res = await axios.post("http://localhost:8080/auth/login",{
                userName,password
            })
            
            const data = res.data
            console.log(data)
            localStorage.setItem("token",data.token)
            setUser({
                userName
            })
            navigate("/chat")
        }catch(e){
            console.log(error)
        }
    }
    return(
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col h-[275px] w-80 bg-slate-50 border border-black rounded-xl font-mono">
                <div>
                    <h1 className="m-2 p-2 text-center font-extrabold text-2xl">
                        Login
                    </h1>
                </div>
                <div className="flex justify-center">
                    <input value={userName} onChange={(e)=>{
                        setUserName(e.target.value)
                    }} className="border border-black m-2 p-2 rounded-md w-9/12" type="text" placeholder="userName" />
                </div>
                <div className="flex justify-center">
                    <input value={password} onChange={(e)=>{
                        setPassword(e.target.value)
                    }} className="border border-black m-2 p-2 rounded-md w-9/12" type="password" placeholder="password" />
                </div>
                <div className="flex justify-center">
                    <button onClick={handleSubmit} className="bg-black text-white m-2 p-2 rounded-lg shadow-lg w-9/12 text-xl font-bold">SUBMIT</button>
                </div>
            </div>
        </div>
    )
}

export default Login