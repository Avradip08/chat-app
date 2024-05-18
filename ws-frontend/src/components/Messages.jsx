import { useState, useEffect } from "react"
import { types } from "../utils/messagesTypes"
import useWebSocket from "react-use-websocket"
import { WS_URL } from "../utils/constants"

const Messages = ({userId})=>{
    
    const [messages,setMessages] = useState([])
    const [messageUserIds,setMessageUserIds] = useState([])
    const {lastJsonMessage} = useWebSocket(WS_URL,{
        share:true
    })
    const handleMessage = (message)=>{
        if(message.type === types.USER_JOINED){
            console.log()
            setMessages(message.payload.messages)
            setMessageUserIds([message.payload.userId])
        }
        if(message.type === types.USER_LEFT){
            setMessages(prev=>{
                const newMessage = message.payload.userId + " : " + message.payload.message
                return [
                    ...prev,
                    newMessage
                ]
            })
        }
        if(message.type === types.MESSAGE_RECEIVED){
            setMessages(prev=>{
                const newMessage = message.payload.userId + " : " +  message.payload.message
                return [
                    ...prev,
                    newMessage
                ]
            })
        }
    }
    useEffect(()=>{
        if(lastJsonMessage!==null){
            console.log(lastJsonMessage)
            handleMessage(lastJsonMessage)
        }
    },[lastJsonMessage])

    return (
        <div className="m-2 p-2 w-[300px] h-[500px] border-[3px] border-slate-700 bg-slate-400 rounded-md">
            <ul>
                {
                    messages.map((m,i)=><li key={i}>{m}</li>)
                }
            </ul>
        </div>
    )
}

export default Messages