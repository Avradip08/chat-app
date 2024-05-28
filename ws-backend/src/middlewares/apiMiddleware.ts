import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
export const apiMiddleWare = async (req:Request,res:Response,next:NextFunction)=>{
    const token = req.headers['authorization']?.split(' ')[1] as string
    jwt.verify(token, "SECRET", (err,user)=>{
        if(err){
           return res.status(403).json({message:"unauthorized"})
        }
        req.body.user = user
        next();
    })
}