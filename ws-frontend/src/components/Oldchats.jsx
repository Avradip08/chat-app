import { useEffect, useState } from "react"
import { API_URL } from "../utils/constants"
import axios from "axios"
import { useNavigate } from "react-router"
import { useSetRecoilState } from "recoil"
import { errorAtom } from "../store/error"

const OldChats = ()=>{
    const [rooms,setRooms] = useState(null)
    const navigate = useNavigate()
    const setError = useSetRecoilState(errorAtom)
    const getTime = (dateString)=>{
        const date = new Date(dateString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
        const day = date.getDate();
        return {
                time : `${hours}:${minutes}:${seconds}`,
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
    const handleJoinOldRoom = async (roomId)=>{
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
        navigate(`../room/old_room/${roomId}`)
    }
    return (
        <div className="flex flex-col justify-center items-center gap-2">
            <div>
                <h1 className="font-bold text-xl">All Chats</h1>
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
                {
                    rooms?.map((r,i)=>{
                        const mTime = getTime(r?.messageTime)
                        return (
                            <div key={r?.roomId} className="p-1 flex justify-between w-80 h-40 border border-collapse border-black cursor-pointer" onClick={
                                ()=>handleJoinOldRoom(r?.roomId)
                                }>
                                <div className="flex flex-col justify-between">
                                    <div className="flex gap-2 font-bold font-sans">
                                        <div>{r?.roomId}</div>
                                        <div>{r?.roomName === null ? `myRoom${i+1}`: r?.roomName}</div>
                                    </div>
                                    <div className="flex justify-between gap-2">
                                        <span>{r?.messageUser}</span>
                                        <span>{r?.messageText}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center items-center text-sm font-light">
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