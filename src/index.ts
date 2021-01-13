import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";

dotenv.config();

connectDB();

const app: express.Application = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("Welcome to Simple Video API"));

app.listen(PORT, () => {
    console.log(`⚡[server]⚡: Running at http://localhost:${PORT}`);
});
