import { randomUUID } from "crypto"
import { WebSocket } from "ws"

export class User {
    private userName : string;
    private socket : WebSocket;
    constructor(userName:string,socket:WebSocket){
        this.userName = userName;
        this.socket = socket;
    }
    getUserName(){
        return this.userName;
    }
    getSocket(){
        return this.socket;
    }
}

export class Message {
    private id : string;
    private type : string;
    private text : string;
    private userName : string;
    private timestamp : number;
    
    constructor (type : string, text:string, userName : string) {
        this.id = randomUUID();
        this.type = type;
        this.text = text;
        this.userName = userName;
        this.timestamp = Date.now();

    }
    getType(){
        return this.type;
    }
    getText(){
        return this.text;
    }
    getUserName(){
        return this.userName;
    }
    getTimestamp(){
        return this.timestamp;
    }
}


export class SocketManager{
    private static instance : SocketManager;
    private userToRoomMapping : Map<string, string[]>;
    private interestedUsers : Map<string, User[]>;
    private roomMessages : Map<string, Message[]>;
    private constructor (){
        this.userToRoomMapping = new Map<string, string[]>();
        this.interestedUsers = new Map<string, User[]>();
        this.roomMessages = new Map<string, Message[]>(); 
    }

    static getInstance() {
        if(this.instance){
            return this.instance;
        }
        this.instance = new SocketManager();
        return this.instance;
    }

    addUser(roomId : string, user : User){
        console.log("add user")
        this.userToRoomMapping.set(
            user.getUserName(),
            [
                ...(this.userToRoomMapping.get(user.getUserName()) || []),
                roomId
            ]
        );
        this.interestedUsers.set(
            roomId,
            [
                ...(this.interestedUsers.get(roomId) || []),
                user
            ]
        );
    }

    broadcast(roomId: string, message: Message){
        console.log('broadcast called')
        const users = this.interestedUsers.get(roomId);
        if(!users){
            console.error('no users present to receive the messages');
            return;
        }
        //add to the room's messages
        const messages = this.roomMessages.get(roomId) || [];
        this.roomMessages.set(roomId,[...messages, new Message(message.getType(),message.getText(),message.getUserName())]);

        //construct message to broadcast
        const res = JSON.stringify({
            type : message.getType(),
            payload : {
                message : message.getText(),
                userName : message.getUserName(),
                timeStamp : message.getTimestamp()
            }
        });

        //broadcasting to all the sockets in the room
        users.forEach((user)=>{
            if(user.getSocket()){
                user.getSocket().send(res);
            }
        });
    }

    removeUser(userName: string,roomId : string){
        //delete the user form the room
        const roomUsers = this.interestedUsers.get(roomId) || [];
        const remainingUsers = roomUsers.filter((roomUser)=>{
            return roomUser.getUserName()!==userName;
        });
        this.interestedUsers.set(roomId,remainingUsers);
        if(this.interestedUsers.get(roomId)?.length===0){
            this.interestedUsers.delete(roomId);
        }
        //delete the room from the user
        const userRooms = this.userToRoomMapping.get(userName) || [];
        const remainingRooms = userRooms.filter((userRoom)=>{
            return userRoom !== roomId;
        })
        this.userToRoomMapping.set(userName,remainingRooms);
        if(this.userToRoomMapping.get(userName)?.length===0){
            this.userToRoomMapping.delete(userName);
        }
    }

}

//todo: add logout logic to broadcast user left in all rooms