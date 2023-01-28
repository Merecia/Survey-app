import { IAnswerQuestion, SurveyAction, SurveyActionTypes } from './../../types/survey';
import { Dispatch } from "redux";
import { RootState } from '../reducers';

export const updateAnswersQuestions = (answerQuestion: IAnswerQuestion) => {

    return async (dispatch: Dispatch<SurveyAction>, getState: () => RootState) => {

        const answersQuestions = getState().survey.answersQuestions;
        const answeredQuestions = answersQuestions.map(answerQuestion => answerQuestion.question);
        const currentQuestion = answerQuestion.question;

        /* 
            We are checking questions that user have already answer and we try to find among
            these questions current question, that user answer just now. If we successfully
            find this question, this means that user gives the answer to this question
            not for the first time. We must change the answer to this question.
            To change the answer to a question, we need to define id of this question.
            The function findIndex returns -1, if current question is 
            not in list of questions that user have already answer.
        */

        const index = answeredQuestions.findIndex(answeredQuestion => 
            JSON.stringify(answeredQuestion) === JSON.stringify(currentQuestion)
        );

        if (index === -1) {
            dispatch({
                type: SurveyActionTypes.UPDATE_ANSWERS_QUESTIONS,
                payload: [...answersQuestions, {
                    question: currentQuestion,
                    answer: answerQuestion.answer
                }]
            })

        } else {
            answersQuestions[index] = answerQuestion;

            dispatch({
                type: SurveyActionTypes.UPDATE_ANSWERS_QUESTIONS,
                payload: answersQuestions
            })
        }
    }
}