import { Router,Request,Response } from "express";
import { db } from "../db";
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'
import { validateUserSignup } from "../middlewares/zodErrors";
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
            return res.status(200).json({error: {userName:"user not found"}})
        }
        let passworMatch = await bcrypt.compare(password,user.password)
        console.log(passworMatch)
        if(passworMatch === false){
            console.log("inside this catch")
            return res.status(200).json({error: { userName : "Username or Password Incorrect"}})
        }
    }catch(e){
        
        return res.status(404).json({
            error: "error occured"
        })
    }
    const token = jwt.sign({userName},"SECRET",{expiresIn:'24h'})
    res.status(200).json({token,message: "logged in successfully"})
})

//signup
authRouter.post("/signup",async (req:Request,res:Response)=>{
    const {userName,email,password,confirmPassword} = req.body
    //do the input validations
    const zodData = validateUserSignup(userName,email,password,confirmPassword)
    if(zodData.success===false){
        let err = {}
        zodData.errors?.map((e)=>{
            err = {
                ...err, [e.field] : e.message
            }
        })
        return res.status(200).json({error:err})
    }
    //check if userName already exists
    try{
        const user = await db.user.findUnique({
            where : {
                userName : userName
            }
        })
        if(user){
            return res.status(200).json({error : {userName:"username already exists"}})
        }
    }catch(e){
        return res.json({
            error: "error occured"
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
            error: "error occured"
        })
    }
    const token = jwt.sign({ userName }, "SECRET", { expiresIn: '24h' });
    return res.status(200).json({token,message:'signup successful'})
})

export default authRouter