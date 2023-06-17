//dotenv is for accessing the variables stored in .env file
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

//some middlewares for cross site data transactions imports
import express from "express";
import mongoose from "mongoose";


//some middlewares for cross site data transactions
const app = express();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

//import for cors it is for resolving cross platform policies errors
import cors from "cors";
// cors it is for resolving cross platform policies errors
app.use(cors());


//creating a static page for displaying images and videos uploaded to be accessible
app.use("/media", express.static("media"));

//general home get route to check server in connected and working properly
app.get("/", (req, res) => {
    res.send("this is a stackoverflow clone API")
});


//all routes imports
import userRouter from "./routes/users.js";
import questionRouter from "./routes/questions.js";
import answerRouter from "./routes/answers.js";
import postRouter from "./routes/post.js";

//all routes 
app.use("/users", userRouter);
app.use("/questions", questionRouter);
app.use("/answers", answerRouter);
app.use("/community", postRouter);

//environment variables for server port and database
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`connected to port ${PORT}`)
});

// const Database_URL = process.env.CONNECTION_URL

// //snippets for database connection and server connection
mongoose.set('strictQuery', true);
mongoose.connect(process.env.CONNECTION_URL, { useUnifiedTopology: true })
    .then(() => console.log(`connected to database`))
    .catch((error) => console.log(error.message));