// routes/mailRoutes.js
import express from "express";
import multer from "multer";
import { sendMailHandler } from "../controllers/mailController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/send", upload.single("resume"), sendMailHandler);

export default router;
