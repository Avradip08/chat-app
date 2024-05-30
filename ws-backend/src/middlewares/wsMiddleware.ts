import jwt from "jsonwebtoken"
export const verifyToken = (token:string)=>{
    const userName = jwt.verify(token,"SECRET")
    return userName
}