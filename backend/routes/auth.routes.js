import express from "express";

import {login, logout,signup} from '../controllers/auth.controller.js';

const router = express.Router();
// router.get("/signup",(req,res) => {
//     res.send("Signup Route");
// });
// to avoid long lines of code in same folder we use controllers
//and write the re.send part in controller folder.
router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

export default router;