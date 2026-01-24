import mongoose from "mongoose"

export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("data base connected successfully 👌")
    } catch (error) {
        throw new Error(error)
    }
}