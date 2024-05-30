import { Router,Request,Response } from "express";
import { db } from "../db";
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'
import { User } from "@prisma/client";
const authRouter = Router()

//login
authRouter.post("/login",async (req:Request,res:Response)=>{
    console.log(req.body)
    const {userName,password} = req.body
    try{
        const user = await db.user.findFirst({
            where:{
                userName
            }
        })
        console.log(user)
        if(!user){
            return res.status(401).json({message:"user not found"})
        }
        let passworMatch = await bcrypt.compare(password,user.password)
        console.log(passworMatch)
        if(passworMatch === false){
            console.log("inside this catch")
            return res.status(401).json({message: "password doesn't match"})
        }
    }catch(e){
        
        return res.status(404).json({
            message: "error occured"
        })
    }
    const token = jwt.sign({userName},"SECRET",{expiresIn:'24h'})
    res.status(200).json({token,message: "logged in successfully"})
})

//signup
authRouter.post("/signup",async (req:Request,res:Response)=>{
    const {userName,email,password} = req.body
    //do the input validations

    //check if userName already exists
    try{
        const user = await db.user.findUnique({
            where : {
                userName : userName
            }
        })
        if(user){
            return res.status(401).json({message : "user with same user name already exists"})
        }
    }catch(e){
        return res.json({
            message: "error occured"
        })
    }
    try{
        let encodedPass =  await bcrypt.hash(password,10)
        await db.user.create({
            data:{
                userName:userName,email:email,password:encodedPass
            }
        })
    }catch(e){
        return res.status(404).json({
            message: "error occured"
        })
    }
    const token = jwt.sign({ userName }, "SECRET", { expiresIn: '24h' });
    return res.status(200).json({token,message:'signup successful'})
})

export default authRouter