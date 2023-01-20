import mongoose, { Schema } from "mongoose";

const { ObjectId } = mongoose.Schema.Types;
const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        caption: {
            type: String,
            required: true,
        },
        media: {
            type: String,
            default: null,
        },
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        comments: [
            {
                type: String,
                postedBy: { type: ObjectId, ref: "User" },
            },
        ],
        userPosted: {
            type: String,
            default: "UNKNOWN",
        },
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;