import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

//user model
import User from "../models/auth.js";

//otp model senmail function
import otp from "../models/otp.js";
import { sendmail } from "./sendEmail.js"


//controller function for signup
export const signUp = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(404).json({ message: "User already exist" })
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const newUser = await User.create({ name, email, password: hashedPassword })
        const token = jwt.sign({ email: newUser.email, id: newUser._id }, "test", { expiresIn: "1h" });
        res.status(201).json({ result: newUser, token })
    } catch (error) {
        res.status(404).json("Something Went Wrong..." + error)
    }
}

//controller function for login
export const logIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User don't exist" })
        }
        const isPasswordCrt = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordCrt) {
            return res.status(400).json({ message: "Invaild username and password" })
        }
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, "test", { expiresIn: "1h" });
        res.status(200).json({ result: existingUser, token })
    } catch (error) {
        res.status(404).json("Something Went Wrong..." + error)
    }
}
//controller function for login
export const logOut = async (req, res) => {
    const { userId } = req.body;
    console.log(userId)
    try {
        const user = await User.findByIdAndUpdate(userId, { verified: false }, { new: true });
        await res.status(200).json({ user, message: "set verified to false" })
    } catch (error) {
        res.status(404).json(error)
    }
}

//controller function for fetching all data
export const userData = async (req, res) => {
    try {
        const UserData = await User.find();
        res.status(200).json(UserData)
    } catch (error) {
        res.status(404).json("Something Went Wrong..." + error)
    }
}

//controller function for sending email
export const sendEmail = async (req, res) => {
    const { email, value } = req.body;
    try {
        const data = await User.findOne({ email });
        const response = {};
        if (data) {
            let otpCode = Math.floor((Math.random() * 10000) + 1);
            const PrevOtpData = await otp.findOne({ email });
            if (PrevOtpData) {
                PrevOtpData.deleteOne();
            }
            let otpData = new otp({
                "email": email,
                "otpCode": otpCode,
            });
            await otpData.save();
            sendmail({ email, otpCode, value });
            response.statusText = "Success";
            response.message = "Please Check Your Email";
        } else {
            response.statusText = "Failure";
            response.message = "Email ID Not Exist";
        }
        res.status(200).json({ "status": response.statusText, "message": response.message })
    } catch (error) {
        res.status(404).json(error.message)
    }
}

//controller function for verifying user
export const verifyUser = async (req, res) => {
    const { email, otpCode } = req.body;
    try {
        const otpData = await otp.findOne({ email, otpCode });
        const response = {};
        if (otpData) {
            let currentTime = new Date().getTime();
            let diff = otpData?.expireIn - currentTime;
            if (diff < 0) {
                await otpData.deleteOne({ email, otpCode });
                response.statusText = "Failure";
                response.message = "OTP Expired";
            } else {
                if (otpData.otpCode === otpCode) {
                    let user = await User.findOne({ email })
                    user.verified = true;
                    await user.save();
                    await otpData.deleteOne({ email, otpCode });
                    return res.status(200).json(user)
                } else {
                    response.statusText = "Failed"
                    response.message = "Invalid OTP"
                }
            }
        } else {
            response.statusText = "Failure";
            response.message = "OTP Expired";
        }
    } catch (error) {
        res.status(404).json(error)
    }
}

//controller function for changing password
export const changePassword = async (req, res) => {
    const { email, otpCode, newPassword } = req.body;
    const newhashedPassword = await bcrypt.hash(newPassword, 12)
    try {
        const otpData = await otp.findOne({ email });
        const response = {};
        if (otpData) {
            let currentTime = new Date().getTime();
            let diff = otpData?.expireIn - currentTime;
            if (diff < 0) {
                await otpData.deleteOne().save();
                response.statusText = "Failed"
                response.message = "OTP Expired"
            } else {
                if (otpData.otpCode === otpCode) {
                    let user = await User.findOne({ email })
                    user.password = newhashedPassword;
                    await user.save()
                    response.statusText = "Success"
                    response.message = "Password Changed"
                } else {
                    response.statusText = "Failed"
                    response.message = "Invalid OTP"
                }
            }
        } else {
            response.statusText = "Failure";
            response.message = "OTP Not Found";
        }
        res.status(200).json({ "text": response.statusText, "message": response.message })
    } catch (error) {
        res.status(404).json(error)
    }
}

//controller function for updating user data
export const updateUserData = async (req, res) => {
    const { id: _id } = req.params;
    const { name, tags, about, verified } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json("user not found");
    }

    try {
        const updateUserProfile = await User.findOneAndUpdate({ _id }, { $set: { "name": name, "tags": tags, "about": about, "verified": verified } }, { new: true })
        res.status(200).json(updateUserProfile)
    } catch (error) {
        res.status(405).json(error.message)
    }
}

//controller function for following and unfollowing users
export const followUser = async (req, res) => {
    const _id = req.params.id;
    const { value, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json("user not found");
    }

    if (!userId) {
        return res.status(422).json("Please login");
    }

    try {
        const userFollowing = await User.findById(userId);
        const followerarrayFollowing = userFollowing.following
        const checkUserfollowedFollowing = followerarrayFollowing.includes(_id);

        if (value === "follow") {
            if (checkUserfollowedFollowing === true) {
                followerarrayFollowing.pop(_id)
            } else {
                followerarrayFollowing.push(_id)
            }
        }
        const userFollower = await User.findById(_id);
        const followerarrayFollower = userFollower.followers
        const checkUserfollowedFollower = followerarrayFollower.includes(userId);

        if (value === "follow") {
            if (checkUserfollowedFollower === true) {
                followerarrayFollower.pop(userId)
            } else {
                followerarrayFollower.push(userId)
            }
        }

        const userfollowedA = await User.findByIdAndUpdate(userId, userFollowing, { new: true }).select("-password")
        const userfollowedB = await User.findByIdAndUpdate(_id, userFollower, { new: true }).select("-password")
        await res.status(200).json([userfollowedA, userfollowedB]);

    } catch (error) {
        console.log(error);
        return res.status(404).json({ message: "Like Error" })
    }

}



