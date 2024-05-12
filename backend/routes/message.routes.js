import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js"

const router = express.Router();

router.get("/:id", protectRoute , getMessages);
router.post("/send/:id", protectRoute , sendMessage); //protect this route before implementing the send message message function...kind of authorization process

export default router;

