import { randomUUID } from "crypto"
import { WebSocket } from "ws"
import { types } from "./message";
export class User {
    public userId : string;
    public socket : WebSocket | null;
    constructor(socket:WebSocket){
        this.userId = randomUUID()
        this.socket = socket
    }
    getUserId(){
        return this.userId
    }
    getSocket(){
        return this.socket
    }
}

export class SocketManager{
    private static instance : SocketManager;
    private userToRoomMapping : Map<String, string>;
    private interestedUsers : Map<string, User[]>;

    private constructor (){
        this.userToRoomMapping = new Map<String, string>();
        this.interestedUsers = new Map<string, User[]>(); 
    }

    static getInstance() {
        if(this.instance){
            return this.instance
        }
        this.instance = new SocketManager()
        return this.instance
    }

    addUser(roomId : string, user : User){
        // console.log("in socket manager " + user.userId +" has joined " + roomId)
        this.userToRoomMapping.set(user.userId,roomId);
        this.interestedUsers.set(
            roomId,
            [
                ...(this.interestedUsers.get(roomId) || []),
                user
            ]
        )
    }

    broadcast(roomId: string, message: string){
        const users = this.interestedUsers.get(roomId)
        if(!users){
            console.error('no users present to receive the messages')
            return
        }
        users.forEach((user)=>{
            if(user.socket){
                user.socket.send(message)
            }
        })
    }

    removeUser(user: User){
        const roomId = this.userToRoomMapping.get(user.getUserId())
        if(!roomId){
            console.error("User was not interested in any room")
            return
        }
        // console.log("in socket manager " + user.userId +" has left " + roomId)
        const res = {
            type : types.USER_LEFT,
            payload: {
                userId : user.userId,
                message : 'has left the chat'
            }
        }
        this.broadcast(roomId,JSON.stringify(res))
        const roomUsers = this.interestedUsers.get(roomId) || []
        const remainingUsers = roomUsers.filter((roomUser)=>{
            return roomUser.getUserId()!==user.getUserId()
        })
        this.interestedUsers.set(roomId,remainingUsers)
        if(this.interestedUsers.get(roomId)?.length===0){
            this.interestedUsers.delete(roomId)
        }
        this.userToRoomMapping.delete(user.getUserId())
        return roomId
    }

}

