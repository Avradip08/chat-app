import { useState } from "react"
import axios from "axios"
import { useSetRecoilState } from "recoil"
import { userAtom } from "../store/user"
import {useNavigate} from 'react-router-dom'
import { AUTH_URL } from "../utils/constants"

const Signup = () =>{
    const [userName,setUserName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')
    const [userNameError, setUserNameError] = useState(null)
    const [emailError, setEmailError] = useState(null)
    const [passwordError, setPasswordError] = useState(null)
    const [confirmPasswordError, setConfirmPasswordError] = useState(null)
    const setUser = useSetRecoilState(userAtom)
    const navigate = useNavigate()
    
    async function handleSubmit(){
        setUserNameError(null)
        setEmailError(null)
        setPasswordError(null)
        setConfirmPasswordError(null)
        try{
                const res = await axios.post(`${AUTH_URL}/signup`,
                    {
                        userName,email,password,confirmPassword
                    }
                )
                const data = res.data
                if(data?.error){
                    const errors = data?.error
                    for(let key in errors){
                        if(key==="userName"){
                            setUserNameError(errors[key])
                        }
                        if(key==="email"){
                            setEmailError(errors[key])
                        }
                        if(key==="password"){
                            setPasswordError(errors[key])
                        }
                        if(key==="confirmPassword"){
                            setConfirmPasswordError(errors[key])
                        }
                    }
                    return
                }
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
                {
                    userNameError !== null &&
                    <div className="flex justify-center">
                        <p className="text-red-600 font-mono text-sm">{userNameError}</p>
                    </div>
                }
                <div className="flex justify-center">
                    <input value={email} onChange={(e)=>{
                        setEmail(e.target.value)
                    }} className="border border-black m-2 p-2 rounded-md w-9/12" type="text" placeholder="email" />
                </div>
                {
                    emailError !== null &&
                    <div className="flex justify-center">
                        <p className="text-red-600 font-mono text-sm">{emailError}</p>
                    </div>
                }
                <div className="flex justify-center">
                    <div className="flex  w-[85%] ml-4">
                        <input value={password} onChange={(e)=>{
                            setPassword(e.target.value)
                        }} className="border border-black m-2 p-2 rounded-md w-full" type="password" placeholder="password" />
                        {/**Tool tip for password */}
                        <div className="relative flex items-center group">
                            <span
                                className="ml-2 text-gray-500 cursor-pointer"
                            >
                                ?
                            </span>
                            <div className="hidden group-hover:block absolute left-0 mt-1 w-60 bg-white border border-gray-400 rounded shadow-lg p-2 z-10 text-xs">
                                <h4 className="font-semibold">Password Requirements:</h4>
                                <ul className="list-disc list-inside mt-2">
                                <li>At least 8 characters long</li>
                                <li>At least one lowercase letter</li>
                                <li>At least one uppercase letter</li>
                                <li>At least one digit</li>
                                <li>At least one special character (@, $, !, %, *, ?, &)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    passwordError !== null &&
                    <div className="flex justify-center">
                        <p className="text-red-600 font-mono text-sm">{passwordError}</p>
                    </div>
                }
                <div className="flex justify-center">
                    <input value={confirmPassword} onChange={(e)=>{
                        setConfirmPassword(e.target.value)
                    }} className="border border-black m-2 p-2 rounded-md w-9/12" type="password" placeholder="confirm password" />
                </div>
                {
                    confirmPasswordError !== null &&
                    <div className="flex justify-center">
                        <p className="text-red-600 font-mono text-sm">{confirmPasswordError}</p>
                    </div>
                }
                <div className="flex justify-center">
                    <button onClick={handleSubmit} className="bg-black text-white m-2 p-2 rounded-lg shadow-lg w-9/12 text-xl font-bold">SUBMIT</button>
                </div>
            </div>
            
        </div>
    )
}

export default Signup