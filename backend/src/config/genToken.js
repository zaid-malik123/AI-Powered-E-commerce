import jwt from "jsonwebtoken"
import logger from "./winston.js";

export const genToken = async (userId, role)=>{
 try {
    const token = jwt.sign({userId, role},process.env.JWT_SECRET,{expiresIn:"7d"})
    return token;
 } catch (error) {
   logger.error("generate token error ", error.message)
    console.log(error)
 }
}