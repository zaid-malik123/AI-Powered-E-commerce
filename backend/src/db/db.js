import mongoose from "mongoose"

export const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)

        if( conn.connection._readyState === 1){

            console.log("data base connected successfully 👌")
            
        }
    } catch (error) {
        throw new Error(error)
    }
}