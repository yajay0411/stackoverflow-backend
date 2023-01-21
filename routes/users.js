import express from 'express';
import { signUp, logIn, updateUserData, userData, followUser } from '../controllers/auth.js';
import auth from "../middlewares/auth.js"

const router = express.Router();

router.post("/signup", signUp)
router.post("/login", logIn)
router.get("/usersdata", auth, userData)
router.patch("/updateuserdata/:id", auth, updateUserData)
router.put("/follow/:id", followUser)

export default router;