import { SocketManager, User, Message } from "./SocketManager";
import { types } from "./message";
import { WebSocket } from "ws";
import { db } from "./db";

export function ChatManager(socket : WebSocket, userName : string, roomId:string){
    if(roomId==="updateChat"){
        addOnlineUser(socket, userName);
    }
    socket.on("message",(data)=>{
        if(roomId!=="updateChat" && roomId!=="null")
        {
            handleMessage(data.toString(),socket,userName,roomId);
        }
    })
    socket.on("close",()=>{
        if(roomId!=="null" && roomId!=="updateChat")
        {
            handleDisconnect(userName,roomId);
        }
        if(roomId==="updateChat"){
            SocketManager.getInstance().removeActiveUser(userName);
        }
    })
}

const handleMessage = async (data : string, socket : WebSocket, userName:string, roomId:string)=>{
    const message = JSON.parse(data);
    console.log(Date.now());
    console.log(message);

    //check if a room has active users
    if(SocketManager.getInstance().isActiveRoom(roomId)!=true){
        const users = await db.userToRoom.findMany({
            where: {
                roomId : roomId
            },
            select : {
                user: {
                    select : {
                        userName : true
                    }
                }
            }
        })
        const userNames = users.map(u=>u.user.userName);
        SocketManager.getInstance().setAllRoomUsers(roomId,userNames);
    }

    if(message.type === types.CREATE_ROOM){
        console.log("create room called");
        const user = new User(userName,socket);
        //add room to user's list of rooms in db
        try{
            await db.user.update({
                where:{
                    userName
                },
                data:{
                    rooms : { 
                        create:{
                            active : true,
                            room : { create : {id : roomId } }
                        }
                    }
                }
            });
        }catch(e){

        }
        //add user to the socket manager
        SocketManager.getInstance().addUser(roomId,user);
        
        const res = new Message(types.USER_JOINED,'has joined the chat',userName);
        
        //add message to the room's list of messages in db
        try {
            await db.room.update({
                where:{
                    id:roomId
                },
                data:{
                    messages : { create: {type:types.USER_JOINED,text:'has joined the chat',userName} }
                }
            });
        } catch (e) {
            
        }
        //broadcast the message to all the users in the room
        SocketManager.getInstance().broadcast(roomId,res);
    }
    if(message.type === types.JOIN_ROOM){
        console.log("join room called");
        const user = new User(userName,socket);

        //add room to the user's list of rooms
        try{
            await db.user.update({
                where:{
                    userName
                },
                data:{
                    rooms : { 
                        upsert : {
                            create : {
                                active : true,
                                room : {connect:{id:roomId}}
                            },
                            update : {
                                active : true
                            },
                            where:{
                                userName_roomId : {
                                    roomId, userName
                                }
                            }
                        }
                    }
                }
            });
        }catch(e){
            console.log('updating userRoom relation error')
            console.log(e);
        }

        //adding the user to in the socket manager
        SocketManager.getInstance().addUser(roomId,user);

        const res = new Message(types.USER_JOINED,'has joined the chat',userName);
        
        //adding the message to the room's list of messages in db
        try{
            await db.room.update({
                where:{
                    id:roomId
                },
                data:{
                    messages:{create:{type:types.USER_JOINED,text:'has joined the chat',userName}}
                }
            });    
        }catch(e){
            console.log('updating messages error')
            console.log(e);
        }
                //broadcasting to all users
        SocketManager.getInstance().broadcast(roomId,res);
    }
    if(message.type === types.JOIN_OLD_ROOM){
        console.log("join old room called");
        const user = new User(userName,socket);

        //updating the user's active status in the room
        await db.userToRoom.update({
            where:{
                userName_roomId : {
                    userName,roomId
                }
            },
            data:{
                active : true
            }
        });

        //adding the user to in the socket manager
        SocketManager.getInstance().addUser(roomId,user);

        const res = new Message(types.USER_JOINED,'has joined the chat',userName);
        
        //adding the message to the room's list of messages in db
        try{
            await db.room.update({
                where:{
                    id:roomId
                },
                data:{
                    messages:{create:{type:types.USER_JOINED,text:'has joined the chat',userName}}
                }
            });
        }catch(e){

        }
        //broadcasting to all users
        SocketManager.getInstance().broadcast(roomId,res);
    }
    if(message.type === types.SEND_MESSAGE){
        console.log("send message called");
        const res = new Message(types.MESSAGE_RECEIVED,message.payload.message,userName);
        
        //add the message to the room's list of messages in db
        try {
            await db.room.update({
                where:{
                    id:roomId
                },
                data:{
                    messages:{create:{type:types.MESSAGE_RECEIVED,text:message?.payload?.message,userName}}
                }
            });
        } catch (e) {
               
        }
        
        //broadcast message to all users in the room
        SocketManager.getInstance().broadcast(roomId,res);
    }
}

const handleDisconnect = async (userName:string, roomId:string) => {
    const res = new Message(types.USER_LEFT,'has left the chat',userName);
    //update the active status for the user in the room
    try {
        await db.userToRoom.update({
        where:{
            userName_roomId : {
                userName,roomId
            }
        },
        data:{
            active:false
        }
    });
    } catch (error) {
        
    }
    
    //add the message to the room's list of messages
    try{
        await db.room.update({
            where:{
                id:roomId
            },
            data:{
                messages:{create:{type:types.USER_LEFT,text:'has left the chat',userName}}
            }
        });
    }catch(e){

    }

    //broadcast the message
    SocketManager.getInstance().broadcast(roomId,res);

    //remove the user from the room
    SocketManager.getInstance().removeUser(userName,roomId);
}

function addOnlineUser(socket:WebSocket, userName : string){
    SocketManager.getInstance().addActiveUser(socket,userName);
}