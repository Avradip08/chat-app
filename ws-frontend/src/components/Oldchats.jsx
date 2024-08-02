import { useEffect, useState } from "react"
import { API_URL } from "../utils/constants"
import axios from "axios"
import { useNavigate } from "react-router"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { errorAtom } from "../store/error"
import { userAtom } from "../store/user"

const OldChats = ({setType,setRoomId})=>{
    const [rooms,setRooms] = useState(null)
    const user = useRecoilValue(userAtom)
    const setError = useSetRecoilState(errorAtom)
    const getTime = (dateString)=>{
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
        const day = date.getDate();
        return {
                time : `${hours}:${minutes}`,
                date : `${day}-${month}-${year}`
        }
    }
    const fetchRooms = async () => {
        const res = await axios.get(`${API_URL}/rooms`,{
            headers : {
                Authorization : "Bearer " + localStorage.getItem("token")
            }
        })
        const rooms = res?.data
        setRooms(rooms)
    }
    useEffect(()=>{
        fetchRooms()
    },[])
    const handleJoinOldRoomExternal = async (roomId)=>{
        setError(null)
        const res = await axios.post(`${API_URL}/userActive`,{
            roomId : roomId
        },{
            headers:{
                Authorization :'Bearer ' + localStorage.getItem('token')
            }
        })
        const data = res?.data
        //check if user is already present in the room
        if(data?.userActive===true){
            //implement toaster
            setError("you are already present in the room");
            return;
        }
        //open in a new tab
        window.open(`../room/old_room/${roomId}`, '_blank' , 'rel=noopener noreferrer')
        //open in same tab
        // navigate(`../room/old_room/${roomId}`)
    }
    const handleJoinOldRoomWindow = async (roomId)=>{
        setError(null)
        const res = await axios.post(`${API_URL}/userActive`,{
            roomId : roomId
        },{
            headers:{
                Authorization :'Bearer ' + localStorage.getItem('token')
            }
        })
        const data = res?.data
        //check if user is already present in the room
        if(data?.userActive===true){
            //implement toaster
            setError("you are already present in the room");
            return;
        }
        setRoomId(roomId)
        setType("old_room")
    }
    return (
        <div className="flex flex-col justify-center items-center gap-2">
            <div className="mx-5 flex flex-col justify-center items-center gap-2">
                {
                    rooms?.map((r,i)=>{
                        const mTime = getTime(r?.messageTime)
                        return (
                            <div key={r?.roomId} className="p-1 flex justify-between w-80 h-20 border border-collapse border-black cursor-pointer hover:bg-slate-100" onClick={
                                (e)=>
                                    {   
                                        e.stopPropagation();
                                        handleJoinOldRoomWindow(r?.roomId);
                                    }
                                }>
                                <div className="flex flex-col justify-between">
                                    <div className="flex gap-2 font-bold font-sans">
                                        <div>{r?.roomId?.substring(0,8)}</div>
                                        <div>{r?.roomName === null ? `myRoom${i+1}`: r?.roomName}</div>
                                    </div>
                                    <div className="flex justify-start space-x-2">
                                        {
                                            user.userName !== r?.messageUser &&
                                            <>
                                                <span className="font-semibold italic">{r?.messageUser}</span>
                                                {
                                                    (r?.messageText!=="has joined the chat" && r?.messageText!=="has left the chat") &&
                                                    <span>:</span>
                                                }
                                                <span>{r?.messageText?.substring(0,20)}</span>
                                            </>
                                        }
                                        {
                                            user.userName === r?.messageUser &&
                                            <>
                                                <span className="font-semibold italic">You</span>
                                                {
                                                    (r?.messageText!=="has joined the chat" && r?.messageText!=="has left the chat") &&
                                                    <span>:</span>
                                                }
                                                {
                                                    (r?.messageText!=="has joined the chat" && r?.messageText!=="has left the chat") &&
                                                    <span>{r?.messageText?.substring(0,20)}</span>
                                                }
                                                {
                                                    (r?.messageText==="has joined the chat") && 
                                                    <span>have joined the chat</span>
                                                }
                                                {
                                                     (r?.messageText==="has left the chat") && 
                                                    <span>have left the chat</span>
                                                }
                                            </>
                                        }    
                                        
                                        
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center items-center text-sm font-light">
                                    <div className="flex justify-between gap-3">
                                        <button
                                            className="hover:bg-slate-500"
                                            onClick={(e)=>{
                                                e.stopPropagation();
                                                handleJoinOldRoomExternal(r?.roomId)
                                            }}
                                        >
                                            <img src="new_window.svg" className="w-5 h-5 bg-transparent" />
                                        </button>
                                        <button
                                            className="hover:bg-slate-500"
                                            onClick={(e)=>{
                                                e.stopPropagation();
                                                //delete chat logic
                                            }}
                                        >
                                            <img src="options.svg" className="w-5 h-5 bg-transparent" />
                                        </button>
                                    </div>
                                    <div>{mTime.date}</div>
                                    <div>{mTime.time}</div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
export default OldChats