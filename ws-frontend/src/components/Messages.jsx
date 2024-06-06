import { useState, useEffect, useRef } from "react"
import { types } from "../utils/messagesTypes"
import useWebSocket from "react-use-websocket"
import { API_URL, WS_URL } from "../utils/constants"
import axios from "axios"
import Message from "./Message"

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
    },[roomId])
    const loadChats = async () => {
        const res = await axios.get(`${API_URL}/${roomId}/messages`,{
            headers : {
                Authorization : "Bearer " + localStorage.getItem('token')
            }
        })

        const data = res?.data
        // console.log(data)
        const prevMessages = data?.map((d)=>{
            return {
                type : d?.type,
                payload : {
                    id : d?.id,
                    message : d?.text,
                    timeStamp : d?.timeStamp,
                    userName : d?.userName
                }
            }
        })
        setMessages(prevMessages)
    }
    //adding a message to the messages list when a message is received
    const handleMessage = (message)=>{
        console.log(message)
        if(message.type === types.USER_JOINED){
            console.log(message)
            setMessages(prev=>[...prev,message])
        }
        if(message.type === types.USER_LEFT){
            setMessages(prev=>[...prev,message])
        }
        if(message.type === types.MESSAGE_RECEIVED){
            setMessages(prev=>[...prev,message])
        }
    }
    useEffect(()=>{
        if(lastJsonMessage!==null){
            console.log(lastJsonMessage)
            handleMessage(lastJsonMessage)
        }
    },[lastJsonMessage])

    return (
        <div className="p-1 w-[130vh] h-[76vh] border-[3px] border-slate-700 bg-slate-100 rounded-md">
            {/* create scrollable component without using fixed */}
            <div className="flex flex-col relative h-[100%] ">
                <div className="flex-1 overflow-y-scroll overflow-x-hidden w-[128vh]">
                    <div className="flex flex-col gap-1">
                        {
                            messages.map((m,i)=><Message key={i} message={m}/>)
                        }
                        <div ref={messagesEndRef}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Messages