import jwt from "jsonwebtoken"
export const verifyToken = (token:string)=>{
    //todo : add failure condition
    const userName = jwt.verify(token,"SECRET")
    return userName
}