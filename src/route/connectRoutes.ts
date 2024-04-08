import express from "express";
import { sendMail } from "../controller/connectCtrl";

const router = express.Router();

router.post("/sendMessage", sendMail);

export default router;
