import mongoose from "mongoose";
import Question from "../models/questions.js";




export const postAnswer = async (req, res) => {
    const { id: _id } = req.params;
    const { noOfAnswers, answerBody, userAnswered, userID } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json("question not found");
    }

    upadateNoOFAnswer(_id, noOfAnswers);

    try {
        const UpdateQuestionData = await Question.findByIdAndUpdate(_id, { $addToSet: { "answer": [{ answerBody, userAnswered, userId: userID }] } });
        res.status(201).json(UpdateQuestionData);

    } catch (error) {
        console.log(error);
        return res.status(404).json("answer not posted");
    }
}



export const deleteAnswer = async (req, res) => {
    const { id: _id } = req.params;
    const { answerID, noOfAnswers } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json("question not found");
    }
    if (!mongoose.Types.ObjectId.isValid(answerID)) {
        return res.status(404).json("answer not found");
    }

    upadateNoOFAnswer(_id, noOfAnswers);

    try {
        const deleteAnswerData = await Question.updateOne({ _id }, { $pull: { "answer": { _id: answerID } } })
        res.status(200).json(deleteAnswerData);

    } catch (error) {
        console.log(error);
        return res.status(404).json("answer not posted");
    }
}


const upadateNoOFAnswer = async (_id, noOfAnswers) => {
    try {
        await Question.findByIdAndUpdate(_id, { $set: { "noOfAnswers": noOfAnswers } });
    } catch (error) {
        console.log(error);
    }
}






