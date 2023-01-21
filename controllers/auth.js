import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/auth.js";
import mongoose from "mongoose";


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

export const userData = async (req, res) => {
    try {
        const UserData = await User.find();
        res.status(200).json(UserData)
    } catch (error) {
        res.status(404).json("Something Went Wrong..." + error)
    }
}

export const updateUserData = async (req, res) => {
    const { id: _id } = req.params;
    const { name, tags, about } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json("user not found");
    }

    try {
        const updateUserProfile = await User.findOneAndUpdate({ _id }, { $set: { "name": name, "tags": tags, "about": about } }, { new: true })
        res.status(200).json(updateUserProfile)
    } catch (error) {
        res.status(405).json(error.message)
    }
}

export const followUser = async (req, res) => {
    const _id = req.params.id;
    const { value, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json("user not found");
    }

    if (!userId) {
        return res.status(422).json("Please login");
    }

    // console.log(_id, value, userId)

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



