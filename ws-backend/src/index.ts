import { ChatManager } from "./ChatHandler"
import express ,{Request,Response} from "express"
import expressWs from 'express-ws';
import { WebSocket } from "ws";

const { app, getWss, applyTo } = expressWs(express());
app.use(express.json())



app.get("/",(req:Request,res:Response)=>{
    res.json({message:"hello world"})
})

app.ws("/",(ws:WebSocket)=>{
    console.log("connection established" + Math.random())
    ChatManager(ws);
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

