import { ChatManager } from "./ChatHandler"
import express ,{Request,Response} from "express"
import expressWs from 'express-ws';
import { WebSocket } from "ws";
import cors from "cors"
import apiRouter from "./router/api";
import authRouter from "./router/auth";
import { verifyToken } from "./middlewares/wsMiddleware";

const PORT = process.env.PORT || 8080;

const { app, getWss, applyTo } = expressWs(express());
app.use(express.json())
app.use(cors())
app.use("/api",apiRouter)
app.use("/auth",authRouter)


app.get("/test",async (req:Request,res:Response)=>{
    res.json({message:"hello world"})
})

app.ws("/",(ws:WebSocket,req:Request)=>{
    console.log("connection established" + Math.random());
    const token = req.query?.token as string;
    const roomId = req.query?.roomId as string;
    console.log(roomId);
    console.log(token);
    
    const user = verifyToken(token) as {userName : string};
    console.log(user.userName);

    console.log(getWss().clients.size)
    ChatManager(ws,user.userName,roomId);
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

