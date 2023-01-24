import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
    try {
        const token = await req?.headers?.authorization?.split(" ")[1];
        let decodeData = jwt?.verify(token, process.env.JWT_SECRET)
        req.userId = decodeData?.id
        if (req.userId = decodeData?.id) {
            return await next();
        }
    } catch (error) {
        console.log(error)
    }
}

export default auth;