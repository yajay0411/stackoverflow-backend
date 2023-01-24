import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otpCode: { type: String, required: true },
    createdAt: { type: Date, default: Date.now(), expires: 120 * 1000 }
});

export default mongoose.model("otp", otpSchema)
