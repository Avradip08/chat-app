import { randomUUID } from "crypto";

export class Message {
    private id : string;
    private type : string;
    private text : string;
    private userId : string;
    private timestamp : Date;
    
    constructor (text : string, type:string, userId : string, timestamp : Date) {
        this.id = randomUUID()
        this.type = type
        this.text = text
        this.userId = userId
        this.timestamp = timestamp

    }
    getText(){
        return this.text
    }
    getUserId(){
        return this.userId
    }
    getTimestamp(){
        return this.timestamp
    }
}

export class Chat{
    private roomId : string;
    private messages : Message[];

    constructor(roomId : string){
        this.roomId = roomId
        this.messages = []
    }
    getRoomId(){
        return this.roomId;
    }
    getMessages(){
        return this.messages;
    }
    addMessage(data:string,type:string,userId:string){
        const message = new Message(data,type,userId,new Date())
        return this.messages.push(message)
    }
}
