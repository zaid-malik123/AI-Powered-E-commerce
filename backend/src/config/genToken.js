import jwt from "jsonwebtoken"

export const genToken = async (userId, role)=>{
 try {
    const token = jwt.sign({userId, role},process.env.JWT_SECRET,{expiresIn:"2d"})
    return token;
 } catch (error) {
    console.log(error)
 }
}