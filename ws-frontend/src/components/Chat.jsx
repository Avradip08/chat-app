import { useEffect, useState } from "react"
import { types } from "../utils/messagesTypes"
import useWebSocket from "react-use-websocket"
import { WS_URL } from "../utils/constants"

const Chat = ({roomId}) =>{
    const {sendJsonMessage,readyState} = useWebSocket(`${WS_URL}?roomId=${roomId}&token=${localStorage.getItem('token')}`,{
        share:true
    })
    const [text,setText] = useState('')
    useEffect(()=>{
    },[roomId])
    const handleMessage = ()=> {
        const data = {
            type : types.SEND_MESSAGE,
            payload : {
                message : text
            }
        }
        sendJsonMessage(data)
    }
    return (
        
        <div className="flex w-[145vh] h-[9vh]">
            <textarea className="w-[125vh] h-[7vh] border-[3px] border-slate-700 bg-slate-100 p-1 mr-2"
                   value={text}
                   onChange={(e)=>setText(e.target.value)}
            />
            <button  className="p1 w-[20vh] h-[7vh] bg-black text-white font-extrabold shadow-xl disabled:bg-slate-500"
                     onClick={handleMessage}
            >
                Send
            </button>
        </div>
    )
}

export default Chat