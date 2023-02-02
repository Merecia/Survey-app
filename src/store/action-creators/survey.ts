import { store } from './../index';
import { 
    IAnswerQuestion, 
    QuestionType, 
    SurveyAction, 
    SurveyActionTypes 
} from './../../types/survey';
import { Dispatch } from "redux";
import { RootState } from '../reducers';

export const updateAnswersQuestions = (answerQuestion: IAnswerQuestion) => {

    return async (dispatch: Dispatch<SurveyAction>, getState: () => RootState) => {

        const answersQuestions = getState().survey.answersQuestions;
        const answeredQuestions = answersQuestions.map(answerQuestion => answerQuestion.question);
        const currentQuestion = answerQuestion.question;

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

export const scoreTest = () => {

    return async (dispatch: Dispatch<SurveyAction>, getState: () => RootState) => {

        const maximumScore: number = calculateMaximumScore();

        console.log(maximumScore);
    }

}

/*
     answersQuestions includes not all questions, only questions that user has answered.
     answersQuestions should be replaced to questions (new state), that include all questions.
     name answersQuestions should be changed to results, because this name is more informative.
*/
const calculateMaximumScore = () => {

    const answersQuestions = store.getState().survey.answersQuestions;

    let maximumScore: number = 0;

    answersQuestions.forEach(answerQuestion => {

        if (answerQuestion.question.type === QuestionType.OneChoice ||
            answerQuestion.question.type === QuestionType.MultipleChoice
        ) {

            answerQuestion.question.options?.forEach(option => {

                const score = option.score;

                if (score && score > 0) maximumScore += score;
            })

        } else if (answerQuestion.question.type === QuestionType.ShortTextField) {

            const score = answerQuestion.question.correctAnswer?.score;

            if (score && score > 0) maximumScore += score;
        }
    })

    return maximumScore;
}

// export const scoreTest = () => {

//     return async (dispatch: Dispatch<SurveyAction>, getState: () => RootState) => {

//         const answersQuestions = getState().survey.answersQuestions;

//         answersQuestions.forEach(answerQuestion => {

//             const correctAnswer = answerQuestion.question.correctAnswer;
//             const userAnswer = answerQuestion.answer;
//             let isUserAnswerCorrect;

//             switch(answerQuestion.question.type) {
//                 case QuestionType.OneChoice:
//                     isUserAnswerCorrect =
//                     (userAnswer as IOption).id ===
//                     (correctAnswer as IOption).id;
//                     break;

//                 case QuestionType.MultipleChoice:
//                     isUserAnswerCorrect =
//                     JSON.stringify(userAnswer as IOption[]) ===
//                     JSON.stringify(correctAnswer as IOption[]);
//                     break;

//                 case QuestionType.ShortTextField:
//                 case QuestionType.DetailedTextField:
//                     isUserAnswerCorrect =
//                     (userAnswer as String).toUpperCase() ===
//                     (correctAnswer as String).toUpperCase();
//                     break;
//             }

//             console.log(userAnswer);
//             console.log(correctAnswer);
//             console.log(isUserAnswerCorrect);
//             console.log('____________________________');
//         })
//     }
// }