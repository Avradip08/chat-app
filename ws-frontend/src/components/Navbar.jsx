import { useRecoilValue, useSetRecoilState } from "recoil"
import { userAtom } from "../store/user"
import Avatar from 'react-avatar';
import { useNavigate } from "react-router";
import { useEffect } from "react";

const Navbar = () =>{
    const user = useRecoilValue(userAtom)
    const setUser = useSetRecoilState(userAtom)
    const navigate = useNavigate()
    return (
        <div className="p-2 bg-slate-50 border-b border-slate-400 font-mono mb-3">
            <div className="flex justify-between">
                <div className="font-bold text-2xl" onClick={()=>{
                    navigate("/")
                }}>Chatty</div>
                {   user.userName!==null ?
                    <div className="flex gap-2">
                        <div className="font-light text-lg"><Avatar name={user.userName} size="35" round={true} textSizeRatio={1.25} color="black"/></div>
                        <div className="flex flex-col justify-center items-center">
                            <button className="p-1 font-sans"
                            onClick={()=>{
                                localStorage.setItem("token",null)
                                setUser({
                                    userName : null
                                })
                                navigate("/")
                            }}>Logout</button>
                        </div>
                    </div> :
                    <div className="flex gap-2">
                        <div className="flex justify-center items-center">
                            <button className="p-1 font-sans" onClick={()=>{
                                navigate("/login")
                            }}>Login</button>
                            <p>/</p>
                            <button className="p-1 font-sans" onClick={()=>{
                                navigate("/signup")
                            }}>Signup</button>   
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Navbar