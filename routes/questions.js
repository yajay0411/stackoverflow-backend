import express from 'express';
import { AskQuestion, GetAllQuestion, GetSelectedQuestion, DeleteSelectedQuestion, VoteQuestion } from '../controllers/questions.js';
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/askquestion", auth, AskQuestion);
router.get("/getallquestions", GetAllQuestion);
router.get("/getselectedquestion/:id", GetSelectedQuestion);
router.delete("/deleteselectedquestion/:id", auth, DeleteSelectedQuestion);
router.patch("/votequestion/:id", auth, VoteQuestion);

export default router;