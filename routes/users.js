import express from 'express';
import { signUp, logIn, updateUserData, userData } from '../controllers/auth.js';
import auth from "../middlewares/auth.js"

const router = express.Router();

router.post("/signup", signUp)
router.post("/login", logIn)
router.get("/usersdata", userData)
router.patch("/updateuserdata/:id", updateUserData)

export default router;