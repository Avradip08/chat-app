import { useState, useEffect, useRef } from "react"
import { types } from "../utils/messagesTypes"
import useWebSocket from "react-use-websocket"
import { API_URL, WS_URL } from "../utils/constants"
import axios from "axios"

const Messages = ({roomId})=>{
    
    const [messages,setMessages] = useState([])
    const {lastJsonMessage} = useWebSocket(`${WS_URL}?roomId=${roomId}&token=${localStorage.getItem('token')}`,{
        share:true
    })
    //chat scrolling logic using useRef
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    //loading the previous chats in the chat room
    useEffect(()=>{
        loadChats();
    },[])
    const loadChats = async () => {
        const res = await axios.get(`${API_URL}/${roomId}/messages`,{
            headers : {
                Authorization : "Bearer " + localStorage.getItem('token')
            }
        })

        const data = res?.data
        const prevMessages = data?.map((d)=>{
            return d.userName + " : "  + d.text
        })
        setMessages(prevMessages)
    }
    //adding a message to the messages list when a message is received
    const handleMessage = (message)=>{
        if(message.type === types.USER_JOINED){
            console.log(message)
            setMessages(prev=>[...prev,message.payload.userName+" : "+message.payload.message])
        }
        if(message.type === types.USER_LEFT){
            setMessages(prev=>[...prev,message.payload.userName+" : "+message.payload.message])
        }
        if(message.type === types.MESSAGE_RECEIVED){
            setMessages(prev=>[...prev,message.payload.userName+" : "+message.payload.message])
        }
    }
    useEffect(()=>{
        if(lastJsonMessage!==null){
            console.log(lastJsonMessage)
            handleMessage(lastJsonMessage)
        }
    },[lastJsonMessage])

    return (
        <div className="m-2 p-1 w-[300px] h-[500px] border-[3px] border-slate-700 bg-slate-400 rounded-md">
            {/* create scrollable component without using fixed */}
            <div className="flex flex-col relative h-[100%] ">
                <div className="flex-1 overflow-y-scroll w-[285px]">
                    <ul>
                        {
                            messages.map((m,i)=><li key={i}>{m}</li>)
                        }
                    </ul>
                    <div ref={messagesEndRef}/>
                </div>
            </div>
        </div>
    )
}

export default Messages