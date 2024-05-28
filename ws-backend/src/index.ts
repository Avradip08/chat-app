import { ChatManager } from "./ChatHandler"
import express ,{Request,Response} from "express"
import expressWs from 'express-ws';
import { WebSocket } from "ws";
import {db} from './db'
import cors from "cors"
import apiRouter from "./router/api";
import authRouter from "./router/auth";

const PORT = process.env.PORT || 8080;

const { app, getWss, applyTo } = expressWs(express());
app.use(express.json())
app.use(cors())
app.use("/api",apiRouter)
app.use("/auth",authRouter)


app.get("/test",async (req:Request,res:Response)=>{
    res.json({message:"hello world"})
})

app.ws("/",(ws:WebSocket)=>{
    console.log("connection established" + Math.random())
    ChatManager(ws);
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

