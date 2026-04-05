// server.js
import express from "express";
import cors from "cors";
import mailRoute from "./routes/mailRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", mailRoute);

app.listen(3000, () => console.log("Server running 🚀"));
