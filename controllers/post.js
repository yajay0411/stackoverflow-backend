import mongoose from "mongoose";
import Post from "../models/post.js";

export const createPost = async (req, res) => {
    const { title, caption, userPosted } = req.body;
    const media = (req.file) ? req.file.filename : null;

    // console.log(title, caption, media,userPosted)
    if (!title || !caption) {
        return res.status(422).json({ error: "Please add all the fields" });
    }

    const newpost = await Post.create({
        title,
        caption,
        media,
        userPosted: userPosted,
    });

    if (newpost) res.status(201).json(newpost);
    else {
        res.status(400);
        throw new Error("Post not Found");
    }
};

export const FetchAllPosts = async (req, res) => {
    try {
        const getAllPost = await Post.find();
        await res.status(200).json(getAllPost)
    } catch (error) {
        console.log(error);
        return res.status(404).json("Posts not found")
    }
}

export const FetchPost = async (req, res) => {
    const _id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json("post not found");
    }
    try {
        const getSelectedPost = await Post.findById(_id);
        await res.status(200).json(getSelectedPost)
    } catch (error) {
        console.log(error);
        return res.status(404).json("Post not found")
    }
}

export const DeletePost = async (req, res) => {
    const _id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json("post not found");
    }
    try {
        const postdelete = await Post.findByIdAndDelete({ _id })
        await res.status(200).json(postdelete);
    } catch (error) {
        console.log(error)
        return res.status(404).json("Post not deleted");
    }
}

export const LikePost = async (req, res) => {
    const _id = req.params.id;
    const { value, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json("Post not found");
    }
    if (!userId) {
        return res.status(422).json("Please login");
    }

    try {
        const post = await Post.findById(_id);
        const likearray = post.likes
        const checkUserLiked = likearray.includes(userId);
        // const downindex = question.downVote.findIndex((id) => id === String(userID));

        if (value === "like") {
            if (checkUserLiked === true) {
                post.likes.pop(userId)
            } else {
                post.likes.push(userId)
            }
        }
        // if (value === "downVote") {
        //     if (upindex !== -1) {
        //         question.upVote = question.upVote.filter((id) => id !== String(userID));
        //     }
        //     if (downindex === -1) {
        //         question.downVote.push(userID)
        //     } else {
        //         question.downVote = question.downVote.filter((id) => id !== String(userID));

        //     }
        // }
        const likePost = await Post.findByIdAndUpdate(_id, post)
        await res.status(200).json(likePost);

    } catch (error) {
        console.log(error);
        return res.status(404).json({ message: "Like Error" })
    }

}


