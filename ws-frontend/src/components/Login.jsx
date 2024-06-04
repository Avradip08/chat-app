import { useState } from "react"
import axios from "axios"
import { useSetRecoilState } from "recoil"
import { userAtom } from "../store/user"
import { useNavigate } from "react-router"
import { AUTH_URL } from "../utils/constants"

const Login = () =>{
    const [userName,setUserName] = useState('')
    const [password,setPassword] = useState('')
    const [userNameError, setUserNameError] = useState(null)
    const setUser = useSetRecoilState(userAtom)
    const navigate = useNavigate()
    async function handleSubmit(){
        setUserNameError(null)
        try{
            const res = await axios.post(`${AUTH_URL}/login`,{
                userName,password
            })
            
            const data = res.data
            if(data?.error){
                const errors = data?.error
                for(let key in errors){
                    if(key==="userName"){
                        setUserNameError(errors[key])
                    }
                }
                return
            }
            setUser({
                userName
            })
            localStorage.setItem("token",data.token)
            navigate("/chat")
        }catch(e){
            console.log(error)
        }
    }
    return(
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col h-[285px] w-80 bg-slate-50 border border-black rounded-xl font-mono">
                <div>
                    <h1 className="m-2 p-2 text-center font-extrabold text-2xl">
                        Login
                    </h1>
                </div>
                <div className="flex flex-col items-center m-0.5 justify-center">
                    <input value={userName} onChange={(e)=>{
                        setUserName(e.target.value)
                    }} className="border border-black p-2 rounded-md w-9/12" type="text" placeholder="userName" />
                    {
                        userNameError === null &&
                        <div className="none h-5"></div>
                    }
                    {
                        userNameError !== null &&
                        <div className="flex justify-center">
                            <p className="text-red-600 font-mono text-sm">{userNameError}</p>
                        </div>
                    }
                </div>
                <div className="flex flex-col items-center m-0.5 justify-center">
                    <input value={password} onChange={(e)=>{
                        setPassword(e.target.value)
                    }} className="border border-black  p-2 rounded-md w-9/12" type="password" placeholder="password" />
                    <div className="none h-5"></div>
                </div>
                <div className="flex justify-center">
                    <button onClick={handleSubmit} className="bg-black text-white m-2 p-2 rounded-lg shadow-lg w-9/12 text-xl font-bold">SUBMIT</button>
                </div>
            </div>
        </div>
    )
}

export default Login