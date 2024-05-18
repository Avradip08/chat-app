import { Chat } from "./Chat";
import { SocketManager, User } from "./SocketManager";
import { types } from "./message";
import { WebSocket } from "ws";

const chats : Chat[] = []
let users : User[] = []

export function ChatManager(socket : WebSocket){
    socket.on("message",(data)=>{
        handleMessage(data.toString(),socket)
    })
    socket.on("close",()=>{
        handleDisconnect(socket)
    })
}

const handleMessage = (data : string, socket : WebSocket)=>{
    const message = JSON.parse(data)
    console.log(message)
    if(message.type === types.CREATE_ROOM){
        // console.log("user created room")
        if(users.find((us)=>us.getSocket()===socket)){
            console.log("user already exists")
            return
        }
        const chat = new Chat (message.payload.roomId)
        chats.push(chat)
        const user = new User(socket)
        users.push(user)
        chat.addMessage(`${user.userId} has joined the chat`,'join',user.userId)
        SocketManager.getInstance().addUser(chat.getRoomId(),user)
        const res = {
            type : types.MESSAGE_RECEIVED,
            payload: {
                userId : user.userId,
                message : 'has joined the chat'
            }
        }
        SocketManager.getInstance().broadcast(chat.getRoomId(),JSON.stringify(res))
    }
    if(message.type === types.JOIN_ROOM){
        // console.log("user joined room")
        if(users.find((us)=>us.getSocket()===socket)){
            console.log("user already exists")
            return
        }
        const chat = chats.find(ch=>ch.getRoomId() === message.payload.roomId)
        if(!chat){
            console.log('room does not exist')
            return
        }
        const user = new User(socket)
        users.push(user)
        chat.addMessage(`${user.userId} has joined the chat`,'join',user.userId)
        SocketManager.getInstance().addUser(chat.getRoomId(),user)
        const res = {
            type : types.USER_JOINED,
            payload: {
                userId : user.userId,
                messages : chat.getMessages().map(m=>m.getText()) || []
            }
        }
        SocketManager.getInstance().broadcast(chat.getRoomId(),JSON.stringify(res))
    }
    if(message.type === types.SEND_MESSAGE){
        const chat = chats.find(ch=>ch.getRoomId() === message.payload.roomId)
        if(chat){
            const user = users.find(us=>us.getSocket()===socket)
            if(user){
                chat.addMessage(message.payload.message,'message',user.userId)
                const res = {
                    type : types.MESSAGE_RECEIVED,
                    payload: {
                        userId : user.userId,
                        message : message.payload.message
                    }
                }
                SocketManager.getInstance().broadcast(chat.getRoomId(),JSON.stringify(res))
            }
        }
    }
}

const handleDisconnect = (socket : WebSocket) => {
    const user = users.find(us => us.getSocket() === socket)
    let roomId = ''
    if(user)
    {
        roomId = SocketManager.getInstance().removeUser(user) || '' 
        const chat = chats.find(c=>c.getRoomId()===roomId)
        if(chat){
            chat.addMessage(`${user.getUserId()} has left the chat`,'left',user.getUserId())
        }
    }
    const newUsers = users.filter(us => us.getSocket() !== socket )
    users = [...newUsers]
}