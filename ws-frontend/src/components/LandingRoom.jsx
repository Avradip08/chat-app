import { useEffect } from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"
import { WS_URL } from "../utils/constants"
import { types } from "../utils/messagesTypes"
import Messages from "./Messages"
import Chat from "./Chat"

const LandingRoom = ({type,roomId,setRoomId})=>{
    const {readyState,sendJsonMessage} = useWebSocket(`${WS_URL}?roomId=${roomId}&token=${localStorage.getItem('token')}`,{
        share:true
    })
    useEffect(()=>{
        let data = {}
        if(type === "join"){
            data = {
                type: types.JOIN_ROOM,
            }
        }else if(type === "create"){
            data = {
                type: types.CREATE_ROOM,
            }
        }else if(type === "old_room"){
            data = {
                type: types.JOIN_OLD_ROOM,
            }
        }
        if(readyState===ReadyState.OPEN)
        {
            sendJsonMessage(data)
        }
          
    },[readyState])
    if(roomId===null){
        return (
            <div>No chat is open</div>
        )
    }
    return (
        <div className="flex flex-col justify-center mr-2">
            <div className="w-[730px]">
                <div className="flex justify-between border-[2px] border-black">
                    <div className="font-bold text-xl ml-2">{roomId}</div>
                    <div className="mr-2">
                        <button className="font-bold text-xl text-red-500"
                            onClick={()=>setRoomId(null)}
                        >
                            x
                        </button>
                    </div>
                </div>
            </div>
            <div>
            <div className="flex justify-center mb-2">
                <Messages roomId={roomId}/>
            </div>
            <div className="flex justify-center ">
                <Chat roomId={roomId}/>
            </div>
            </div>
        </div>
    )
}
export default LandingRoom