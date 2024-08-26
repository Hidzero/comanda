import express from "express";
const app = express();

import cors from "cors";
app.use(cors());

app.use(express.json())

import connectDB from "./database.js";
connectDB();

import UserRoutes from "./src/Routes/userRoute.js";
app.use("/user", UserRoutes);

app.listen(process.env.PORT, () => {
    console.log(`link: http://localhost:${process.env.PORT}`)
})