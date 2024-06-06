import { useParams } from "react-router"
import Chat from "./Chat"
import Messages from "./Messages"
import useWebSocket, { ReadyState } from "react-use-websocket"
import { WS_URL } from "../utils/constants"
import { useEffect} from "react"
import { types } from "../utils/messagesTypes"

const Room = () => {
    const {type,id} = useParams()
    const {readyState,sendJsonMessage} = useWebSocket(`${WS_URL}?roomId=${id}&token=${localStorage.getItem('token')}`,{
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
    
    return (
        <div className="flex justify-center mr-2">
            <div>
            <div className="flex justify-center my-2">
                <Messages roomId={id}/>
            </div>
            <div className="flex justify-center ">
                <Chat roomId={id}/>
            </div>
            </div>
        </div>
    )
}

export default Room