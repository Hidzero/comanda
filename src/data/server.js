import express from "express";
// import path from "path";
const app = express();

// Serve os arquivos estáticos do React
app.use(express.static(path.join(__dirname, 'build')));

// Rota padrão que serve o React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

import cors from "cors";
app.use(cors());

app.use(express.json())

import connectDB from "./database.js";
connectDB();

import UserRoutes from "./src/Routes/userRoute.js";
app.use("/user", UserRoutes);

import TableRoutes from "./src/Routes/tableRoute.js";
app.use("/table", TableRoutes);

import OrderRoutes from "./src/Routes/orderRoute.js";
app.use("/order", OrderRoutes);

import ProductRoutes from "./src/Routes/productRoute.js";
app.use("/product", ProductRoutes);

import dotenv from 'dotenv';
dotenv.config();

app.listen(process.env.PORT, () => {
    console.log(`link: http://localhost:${process.env.PORT}`)
})