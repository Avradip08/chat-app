import { Router,Request,Response } from "express";
import { db } from "../db";
import {apiMiddleWare} from "../middlewares/apiMiddleware";
const apiRouter = Router()
//adding middleware for all api routes
apiRouter.all(`/*`,apiMiddleWare as any)

//get authentication details
apiRouter.get("/me",async (req:Request,res:Response)=>{
    console.log(req.body)
    const {user} = req.body
    return res.json({user,message:"user is authenticated"})
})

//get all chats of a user
apiRouter.get("/rooms",async (req:Request,res:Response)=>{
    const {user} = req.body
    const {userName} = user
    console.log(userName)
    try{
        const rooms = await db.userToRoom.findMany({
            where:{
                userName
            },
            select:{
                room : {
                    select : {
                        id : true,
                        name : true,
                        messages : {

                            select : {
                                id:true, userName:true , text:true , timeStamp:true
                            },orderBy : {
                                id : "desc"
                            },take:1
                        }
                    }
                }
            },
        })
        //modeling our data for frontend ease
        const info = rooms?.map(m=>{
            return {
                roomId : m?.room?.id,
                roomName : m?.room?.name,
                messageId : m?.room?.messages[0]?.id,
                messageText : m?.room?.messages[0]?.text,
                messageUser : m?.room?.messages[0]?.userName,
                messageTime : m?.room?.messages[0]?.timeStamp,
            }
        }) || []
        //sorting based on date
        const sortedInfo = info.sort((a, b) => {
            const dateA: Date = new Date(a.messageTime);
            const dateB: Date = new Date(b.messageTime);
          
            return dateB.getTime() - dateA.getTime();
        });
        return res.status(200).json(sortedInfo)
    }catch(e){
        return res.status(404).send({message:"error occured"})
    }
})
//get all messages in a chat
apiRouter.get(`/:roomId/messages`,async (req:Request,res:Response)=>{
    try{
        const {roomId} = req.params
        const messages = await db.message.findMany({
            where: {
              roomId
            },
            orderBy: {
              id: 'asc', 
            },
          })
        return res.status(200).json(messages)
    }catch(e){
        return res.status(404).json({message:"error ocurred"})
    }
    
})

//check if room id exists in db
apiRouter.post('/roomExists',async (req:Request,res:Response)=>{
    const {roomId} = req.body
    console.log(roomId)
    try{
        let roomExists = false;
        const room = await db.room.findUnique({
            where:{
                id:roomId
            }
        })
        console.log(room)
        if(room!==null){
            roomExists = true
        }
        res.status(200).json({roomExists})
    }catch(e){
        console.log(e)
        res.status(404).json({message:"error occured"})
    }
})

//check if the user is currently active in the room
apiRouter.post('/userActive', async (req:Request,res:Response)=>{
    const {roomId} = req.body 
    const {user} = req.body
    const {userName} = user
    try {
        let userActive = false;
        const user = await db.userToRoom.findUnique({
            where:{
                userName_roomId:{
                    userName,roomId
                }
            },
            select:{
                active:true
            }
        });
        if(user?.active===true){
            userActive=true
        }
        res.status(200).json({userActive});
    } catch (e) {
        res.status(404).json({message:"error occured"})
    }
})
export default apiRouter;