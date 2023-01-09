import express from 'express';
import { postAnswer, deleteAnswer } from '../controllers/answer.js';
import auth from "../middlewares/auth.js";

const router = express.Router();

router.patch("/postanswer/:id", auth, postAnswer);
router.patch("/deleteanswer/:id", auth, deleteAnswer);

export default router;