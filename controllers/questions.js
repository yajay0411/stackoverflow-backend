import mongoose from "mongoose";
import Question from "../models/questions.js";


export const AskQuestion = async (req, res) => {
    try {
        const postQuestionData = req.body;
        const postQuestion = new Question({ ...postQuestionData, userId: req.userId });
        await postQuestion.save();
        res.status(201).json("question posted")

    } catch (error) {
        console.log(error);
        return res.status(404).json("question not posted")
    }
}

export const GetAllQuestion = async (req, res) => {
    try {
        const getQuestionData = await Question.find();
        res.status(200).json(getQuestionData)
    } catch (error) {
        console.log(error);
        return res.status(404).json("questions not found")
    }
}

export const GetSelectedQuestion = async (req, res) => {
    try {
        const id = req.params.id
        const getSelectedQuestionData = await Question.findById(id);
        if (!getSelectedQuestionData) {
            return res.status(404).send("Question not found")
        } else {
            return res.status(200).json(getSelectedQuestionData)
        }

    } catch (error) {
        console.log(error);
        return res.status(404).json("questions not found")
    }
}
export const DeleteSelectedQuestion = async (req, res) => {
    try {
        const id = req.params.id
        const deleteSelectedQuestionData = await Question.findByIdAndDelete(id);
        if (!deleteSelectedQuestionData) {
            return res.status(404).send("Question not found")
        } else {

            return res.status(200).json("delete selected question")
        }

    } catch (error) {
        console.log(error);
        return res.status(404).json("questions not found")
    }
}


export const VoteQuestion = async (req, res) => {
    const { id: questionID } = req.params;
    const { value, userID } = req.body;

    if (!mongoose.Types.ObjectId.isValid(questionID)) {
        return res.status(404).json("question not found");
    }
    try {
        const question = await Question.findById(questionID);
        const upindex = question.upVote.findIndex((id) => id === String(userID));
        const downindex = question.downVote.findIndex((id) => id === String(userID));

        if (value === "upVote") {
            if (downindex !== -1) {
                question.downVote = question.downVote.filter((id) => id !== String(userID));
            }
            if (upindex === -1) {
                question.upVote.push(userID)
            } else {
                question.upVote = question.upVote.filter((id) => id !== String(userID));

            }
        }
        if (value === "downVote") {
            if (upindex !== -1) {
                question.upVote = question.upVote.filter((id) => id !== String(userID));
            }
            if (downindex === -1) {
                question.downVote.push(userID)
            } else {
                question.downVote = question.downVote.filter((id) => id !== String(userID));

            }
        }
        const voteQuestion = await Question.findByIdAndUpdate(questionID, question)
        res.status(200).json(voteQuestion)

    } catch (error) {
        console.log(error);
        return res.status(404).json({ message: "vote Error" })
    }

}