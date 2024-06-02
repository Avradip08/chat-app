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
        
        <div className="flex w-[130vh] h-[9vh]">
            <textarea className="w-[110vh] h-[8vh] border border-slate-500 rounded-md bg-slate-200 p-1 mr-2"
                   value={text}
                   onChange={(e)=>setText(e.target.value)}
            />
            <button  className="p1 w-[20vh] h-[7vh] bg-black text-white font-extrabold rounded-md shadow-xl disabled:bg-slate-500"
                     onClick={handleMessage}
            >
            Send
            </button>
        </div>
    )
}

export default Chat