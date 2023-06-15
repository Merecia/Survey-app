import {
    IAnswerToQuestion,
    IQuestion,
    ISurvey,
    ISurveyInfo,
    QuestionType,
    SurveyAction,
    SurveyActionTypes
} from './../../types/survey';
import { Dispatch } from "redux";
import { RootState } from '../reducers';

export const updateAnswersToQuestions = (answersToQuestions: IAnswerToQuestion[]) => {
    return async (dispatch: Dispatch<SurveyAction>) => {
        dispatch({
            type: SurveyActionTypes.UPDATE_ANSWERS_TO_QUESTIONS,
            payload: answersToQuestions
        })
    }
}

export const updateSurveyCards = (surveyCards: ISurveyInfo[]) => {
    return async (dispatch: Dispatch<SurveyAction>) => {
        dispatch({
            type: SurveyActionTypes.UPDATE_SURVEY_CARDS,
            payload: surveyCards
        });
    }
}

export const loadSurveyCards = () => {
    return async (dispatch: Dispatch<SurveyAction>) => {
        const surveys = localStorage.getItem('surveys');

        const surveyCards = surveys ? JSON.parse(surveys).map(
            (survey: ISurvey) => survey.surveyInfo
        ) : null;
    
        dispatch({
            type: SurveyActionTypes.UPDATE_SURVEY_CARDS,
            payload: surveyCards
        });
    }
}

export const removeSurveyCard = (id: number) => {
    return async (dispatch: Dispatch<SurveyAction>, getState: () => RootState) => {
        const surveyCards = getState().survey.surveyCards
            .filter((survey: ISurveyInfo) => survey.id !== id)
            .map((survey: ISurveyInfo, index: number) => {
                return {
                    id: index + 1,
                    title: survey.title,
                    description: survey.description,
                    category: survey.category,
                    imageUrl: survey.imageUrl,
                    maximumPassingTimeSeconds: survey.maximumPassingTimeSeconds,
                    maximumScore: survey.maximumScore,
                    isEvaluated: survey.isEvaluated
                };
            });

        dispatch({
            type: SurveyActionTypes.UPDATE_SURVEY_CARDS,
            payload: surveyCards
        })
    }
}

export const updateAnswerToQuestion = (answerToQuestion: IAnswerToQuestion) => {
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

        console.log(index);

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

export const updateQuestions = (questions: IQuestion[]) => {
    return async (dispatch: Dispatch<SurveyAction>) => {
        dispatch({
            type: SurveyActionTypes.UPDATE_QUESTIONS,
            payload: questions
        })
    }
}

export const clearQuestions = () => {
    return async (dispatch: Dispatch<SurveyAction>) => {
        dispatch({
            type: SurveyActionTypes.UPDATE_QUESTIONS,
            payload: []
        })
    }
}

export const clearAnswersToQuestions = () => {
    return async (dispatch: Dispatch<SurveyAction>) => {
        dispatch({
            type: SurveyActionTypes.UPDATE_ANSWERS_TO_QUESTIONS,
            payload: []
        })
    }
}

export const updateQuestionRequired = (question: IQuestion, required: boolean) => {
    return async (dispatch: Dispatch<SurveyAction>, getState: () => RootState) => {
        question.required = required;
        const questions = getState().survey.questions;
        questions[question.id - 1] = question;

        dispatch({
            type: SurveyActionTypes.UPDATE_QUESTIONS,
            payload: questions
        })
    }
}

export const updateQuestion = (question: IQuestion) => {
    return async (dispatch: Dispatch<SurveyAction>, getState: () => RootState) => {
        const questions = getState().survey.questions;
        questions[question.id - 1] = question;

        dispatch({
            type: SurveyActionTypes.UPDATE_QUESTIONS,
            payload: questions
        })
    }
}

export const updateSurveyInfo = (surveyInfo: ISurveyInfo) => {
    return async (dispatch: Dispatch<SurveyAction>) => {
        dispatch({
            type: SurveyActionTypes.UPDATE_SURVEY_INFO,
            payload: surveyInfo
        })
    }
}

export const addNewQuestion = () => {
    return async (dispatch: Dispatch<SurveyAction>, getState: () => RootState) => {
        const questions = getState().survey.questions;
        const isEvaluated = getState().survey.surveyInfo.isEvaluated;

        const lastId = questions.length;
        const initialOptions = isEvaluated
            ? [{ id: 1, label: "", score: 0 }]
            : [{ id: 1, label: "" }];

        const newQuestion = {
            id: lastId + 1,
            topic: "",
            type: QuestionType.OneChoice,
            required: false,
            options: initialOptions
        };

        questions.push(newQuestion);

        dispatch({
            type: SurveyActionTypes.UPDATE_QUESTIONS,
            payload: questions
        });
    }
}

export const loadSurvey = (id: number) => {
    return async (dispatch: Dispatch<SurveyAction>) => {
        const surveys = localStorage.getItem('surveys');
        const survey = surveys
            ? JSON.parse(surveys).find((survey: ISurvey) => survey.surveyInfo.id === id)
            : null;

        dispatch({
            type: SurveyActionTypes.UPDATE_QUESTIONS,
            payload: survey.questions
        });

        dispatch({
            type: SurveyActionTypes.UPDATE_SURVEY_INFO,
            payload: survey.surveyInfo
        });
    }
}

export const deleteQuestion = (question: IQuestion) => {
    return async (dispatch: Dispatch<SurveyAction>, getState: () => RootState) => {
        const questions = getState().survey.questions
            .filter(item => item.id !== question.id)
            .map((item, index) => {
                if (
                    item.type === QuestionType.OneChoice ||
                    item.type === QuestionType.MultipleChoice ||
                    item.type === QuestionType.Matchmaking
                ) {
                    return {
                        id: index + 1,
                        topic: item.topic,
                        type: item.type,
                        required: item.required,
                        options: item.options
                    }
                } else {
                    return {
                        id: index + 1,
                        topic: item.topic,
                        type: item.type,
                        required: item.required,
                        correctAnswer: item.correctAnswer
                    }
                }

            });

        dispatch({
            type: SurveyActionTypes.UPDATE_QUESTIONS,
            payload: questions
        });
    }
}

export const updateQuestionTopic = (question: IQuestion, topic: string) => {
    return async (dispatch: Dispatch<SurveyAction>, getState: () => RootState) => {
        question.topic = topic;
        const questions = getState().survey.questions;
        questions[question.id - 1] = question;

        dispatch({
            type: SurveyActionTypes.UPDATE_QUESTIONS,
            payload: questions
        })
    }
}

export const updateQuestionType = (
    question: IQuestion,
    type: QuestionType,
    isEvaluated: boolean
) => {
    return async (dispatch: Dispatch<SurveyAction>, getState: () => RootState) => {
        question.type = type;

        if (
            question.type === QuestionType.OneChoice ||
            question.type === QuestionType.MultipleChoice
        ) {
            if (question.hasOwnProperty('correctAnswer')) {
                delete question.correctAnswer;
            }

            const initialOptions = isEvaluated
                ? [{ id: 1, label: "", score: 0 }]
                : [{ id: 1, label: "" }];

            question.options = initialOptions;
        } else if (
            question.type === QuestionType.ShortTextField ||
            question.type === QuestionType.DetailedTextField
        ) {
            if (question.hasOwnProperty('options')) {
                delete question.options;
            }

            const initialCorrectAnswer = { text: '', score: 0 };

            if (isEvaluated) {
                question.correctAnswer = initialCorrectAnswer;
            }
        } else if (
            question.type === QuestionType.Matchmaking
        ) {
            if (question.hasOwnProperty('correctAnswer')) {
                delete question.correctAnswer;
            }

            const initialLeftList = isEvaluated
                ? [{ id: 1, label: '', relatedOptionId: 1, score: 1 }]
                : [{ id: 1, label: '' }];

            const initialRightList = [{ id: 1, label: '' }];

            question.options = {
                leftList: initialLeftList,
                rightList: initialRightList
            };
        }

        const updatedQuestions = [...getState().survey.questions];
        updatedQuestions[question.id - 1] = question;

        dispatch({
            type: SurveyActionTypes.UPDATE_QUESTIONS,
            payload: updatedQuestions
        })
    }
}