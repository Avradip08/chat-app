import { useParams } from "react-router"
import Chat from "./Chat"
import Messages from "./Messages"
import useWebSocket, { ReadyState } from "react-use-websocket"
import { WS_URL } from "../utils/constants"
import { useEffect, useState } from "react"
import { types } from "../utils/messagesTypes"

const Room = () => {
    const {type,id} = useParams()
    const [userId,setUserId] = useState('')
    const {readyState,sendJsonMessage,lastJsonMessage} = useWebSocket(WS_URL,{
        share:true
    })
    useEffect(()=>{
        let data = {}
        if(type === "join"){
            data = {
                type: types.JOIN_ROOM,
                payload : {
                    roomId : id
                }
            }
        }else if(type === "create"){
            data = {
                type: types.CREATE_ROOM,
                payload : {
                    roomId : id
                }
            }
        }
        if(readyState===ReadyState.OPEN)
        {
            sendJsonMessage(data)
        }
          
    },[readyState])
    
    return (
        <div className="">
            <div className="flex justify-center">
                <Messages userId={userId}/>
            </div>
            <div className="flex justify-center">
                <Chat roomId={id}/>
            </div>
        </div>
    )
}

export default Room