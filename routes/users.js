import express from 'express';
import { signUp, logIn, logOut, sendEmail, verifyUser, changePassword, updateUserData, userData, followUser } from '../controllers/auth.js';
import auth from "../middlewares/auth.js"

const router = express.Router();

//user signup
router.post("/signup", signUp);

//user login
router.post("/login", logIn);

//user logout
router.post("/logout", logOut);

//send email to user
router.post("/sendemail", sendEmail);

//check otp and verify user
router.post("/authenticateuser", verifyUser);

//check otp and change password
router.post("/changepassword", changePassword);

//get all user data
router.get("/usersdata", userData);

//update selected user data
router.patch("/updateuserdata/:id", auth, updateUserData);

//follow and unfollow user
router.put("/follow/:id", followUser);

export default router;