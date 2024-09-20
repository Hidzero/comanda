import mongoose from "mongoose"
import dotenv from 'dotenv';
dotenv.config({path: './src/data/.env'});

export default async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected")
    } catch (error) {
        console.log(error)
    }
}