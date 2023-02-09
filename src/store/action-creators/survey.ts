import { store } from './../index';
import {
    IAnswerToQuestion,
    SurveyAction,
    SurveyActionTypes
} from './../../types/survey';
import { Dispatch } from "redux";
import { RootState } from '../reducers';
import { isMatches, isOption, isTextAnswer } from '../../helper';

export const updateAnswersQuestions = (answerToQuestion: IAnswerToQuestion) => {

    return async (dispatch: Dispatch<SurveyAction>, getState: () => RootState) => {

        const answersToQuestions = getState().survey.answersToQuestions;
        const answeredQuestions = answersToQuestions.map(answerToQuestion => answerToQuestion.question);
        const currentQuestion = answerToQuestion.question;

        /* 
            We are checking questions that user has already answered and we try to find among
            these questions current question, that user has answered just now. If we successfully
            find this question, this means that user has given the answer to this question
            not for the first time. We must change the answer to this question.
            To change the answer to a question, we need to define id of this question.
            The function findIndex returns -1, if current question is 
            not in list of questions that user has already answered.
        */

        const index = answeredQuestions.findIndex(answeredQuestion =>
            JSON.stringify(answeredQuestion) === JSON.stringify(currentQuestion)
        );

        if (index === -1) {
            dispatch({
                type: SurveyActionTypes.UPDATE_ANSWERS_TO_QUESTIONS,
                payload: [...answersToQuestions, {
                    question: currentQuestion,
                    answer: answerToQuestion.answer
                }]
            })

        } else {
            answersToQuestions[index] = answerToQuestion;

            dispatch({
                type: SurveyActionTypes.UPDATE_ANSWERS_TO_QUESTIONS,
                payload: answersToQuestions
            })
        }
    }
}

/*
     answersQuestions includes not all questions, only questions that user has answered.
     answersQuestions should be replaced to questions (new state), that include all questions.
     name answersQuestions should be changed to results, because this name is more informative.
*/

export const finishTest = () => {

    return async (dispatch: Dispatch<SurveyAction>, getState: () => RootState) => {

        console.log(getState().survey.answersToQuestions);

        console.log('Оценка за тест: ' + scoreTest());
    }
}

export const scoreTest = (): number => {

    const answersToQuestions = store.getState().survey.answersToQuestions;

    let totalScore: number = 0;

    answersToQuestions.forEach(answerToQuestion => {

        const answer = answerToQuestion.answer;

        if (isOption(answer) || isTextAnswer(answer)) {

            const score = answer.score ?? 0;

            totalScore += score;

        } else if (isMatches(answer)) {

            answer.leftList.forEach(option => {

                const score = option.score ?? 0;

                totalScore += score;
            })

        } else {

            answer.forEach(option => {

                const score = option.score ?? 0;

                totalScore += score;
            })
        }
    })

    return totalScore;
}