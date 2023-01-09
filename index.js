import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRouter from "./routes/users.js";
import questionRouter from "./routes/questions.js";
import answerRouter from "./routes/answers.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());


app.get("/", (req, res) => {
    res.send("this is a stackoverflow clone API")
});


app.use("/users", userRouter);
app.use("/questions", questionRouter);
app.use("/answers", answerRouter);

const PORT = process.env.PORT || 5000;

mongoose.set('strictQuery', true);
mongoose.connect(process.env.CONNECTION_URL, {
    useUnifiedTopology: true,
}).then(() => app.listen(PORT, () => {
    console.log(`connected to port ${PORT}`)
    console.log(`connected to database`)
})).catch((error) => {
    console.log(error.message)
})