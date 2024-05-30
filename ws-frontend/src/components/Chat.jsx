import { useEffect, useState } from "react"
import { types } from "../utils/messagesTypes"
import useWebSocket from "react-use-websocket"
import { WS_URL } from "../utils/constants"

const Chat = ({roomId}) =>{
    const {sendJsonMessage,readyState} = useWebSocket(`${WS_URL}?roomId=${roomId}&token=${localStorage.getItem('token')}`,{
        share:true
    })
    const [text,setText] = useState('')
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
        
        <div>
            <input className="w-[220px] h-[40px] border border-slate-500 rounded-md bg-slate-200 px-2"
                   value={text}
                   onChange={(e)=>setText(e.target.value)}
            />
            <button  className="p-1 m-2 w-[70px] h-[40px] bg-green-400 text-white font-extrabold text-xl rounded-lg shadow-lg disabled:bg-slate-500"
                     onClick={handleMessage}
            >
            Send
            </button>
        </div>
    )
}

export default Chat