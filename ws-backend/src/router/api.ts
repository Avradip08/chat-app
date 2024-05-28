import { Router,Request,Response } from "express";
import { db } from "../db";
import {apiMiddleWare} from "../middlewares/apiMiddleware";
const apiRouter = Router()
//adding middleware for all api routes
// apiRouter.all(`/*`,apiMiddleWare as any)

//get authentication details
apiRouter.get("/me",async (req:Request,res:Response)=>{
    console.log(req.body)
    const {user} = req.body
    return res.json({user,message:"user is authenticated"})
})

//get all chats of a user
apiRouter.get("/chats",async (req:Request,res:Response)=>{
    const {userName} = req.body
    try{
        const user = await db.user.findFirst({
            where:{
                userName
            },
            include:{
                rooms : true
            }
        })
        res.status(200).json({rooms : user?.rooms})
    }catch(e){
        res.status(404).send({message:"error occured"})
    }
})
//get all messages in a chat
apiRouter.get(`/:roomId/messages`,async (req:Request,res:Response)=>{
    try{
        const {roomId} = req.params
        const room = await db.room.findFirst({
            where:{
                id : roomId
            },
            include:{
                messages:true
            }
        })
        res.status(200).json({messages:room?.messages})
    }catch(e){
        res.status(404).json({message:"error ocurred"})
    }
    
})
export default apiRouter;