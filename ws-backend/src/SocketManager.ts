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
    getId(){
        return this.id
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
    //keeps track of all rooms a user is currently chatting in(has the room window open)
    private userToRoomMapping : Map<string, string[]>;
    //keeps track of all users in a chat who have the chat window open(reverse mapping of the above)
    private interestedUsers : Map<string, User[]>;
    //keeps track of all the users active currently
    private activeUsers : Map<string,WebSocket[]>;
    //keeps a list of all users in a room which is active (contains at least one active user)
    private allRoomUsers : Map<string, string[]>;
    
    private constructor (){
        this.userToRoomMapping = new Map<string, string[]>();
        this.interestedUsers = new Map<string, User[]>();
        this.activeUsers = new Map<string,WebSocket[]>();
        this.allRoomUsers = new Map<string, string[]>();
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

        //construct message to broadcast
        const res = JSON.stringify({
            type : message.getType(),
            payload : {
                id : message.getId(),
                message : message.getText(),
                userName : message.getUserName(),
                timeStamp : message.getTimestamp(),
                roomId : roomId
            }
        });

        //broadcasting to all the sockets in the room
        users.forEach((user)=>{
            if(user.getSocket()){
                user.getSocket().send(res);
            }
        });

        //for updating chat list for all active users part of roomId
        this.updateChats(roomId,res)
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
            this.allRoomUsers.delete(roomId);
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

    addActiveUser(socket:WebSocket, userName:string){
        this.activeUsers.set(userName,
            [
                ...(this.activeUsers.get(userName) || []),
                socket
            ]
        );
    }

    removeActiveUser(userName: string){
        const remInd : number[] = [];
        this.activeUsers.get(userName)?.forEach((user,ind)=>{
            if(user.readyState===WebSocket.CLOSED)
                remInd.push(ind)
        })
        for(let i=remInd.length-1;i>=0;--i){
            this.activeUsers.get(userName)?.splice(remInd[i],1);
        }
        if(this.activeUsers.get(userName)?.length==0)
            this.activeUsers.delete(userName);
    }

    setAllRoomUsers(roomId: string, users: string[]){
        this.allRoomUsers.set(roomId,users);
    }

    isActiveRoom(roomId:string) : boolean{
        return this.allRoomUsers.has(roomId);
    }

    updateChats(roomId:string,res:string){
        console.log("update chats called")
        console.log(res);
        console.log(this.allRoomUsers);
        console.log(this.activeUsers.keys());
        const users = this.allRoomUsers.get(roomId);
        if(users){
            users.forEach(user=>{
                if(this.activeUsers.has(user)){
                    this.activeUsers.get(user)?.map(u=>u.send(res));
                }
            })
        }
    }
}

//todo: add logout logic to broadcast user left in all rooms