import { getFeedback } from "../helper";
import { IAnswer, IAnswerToQuestion, IQuestion, QuestionType } from "../types/survey";

const option1 = {id: 1, label: '3', score: 1};
const option2 = {id: 2, label: '-3', score: 1};
const option3 = {id: 3, label: '3.5', score: -1};

const question: IQuestion =  {
    id: 1,
    topic: 'x^2 = 9',
    type: QuestionType.MultipleChoice,
    required: true,
    options: [option1, option2, option3]
} as IQuestion;

const incorrectAnswerToQuestion: IAnswerToQuestion = {
    question: question,
    answer: [option3] as IAnswer
};

const partiallyCorrectAnswerToQuestion: IAnswerToQuestion = {
    question: question,
    answer: [option1, option3] as IAnswer
};

const correctAnswerToQuestion: IAnswerToQuestion = {
    question: question,
    answer: [option1, option2] as IAnswer
};

describe('Get feedback', () => {
    test('Incorrect answer', () => {
        expect(getFeedback(incorrectAnswerToQuestion)).toEqual({
            totalScore: -1, maximumScore: 2, correctAnswers: ['3', '-3'] 
        });
    })
    test('Partially correct answer', () => {
        expect(getFeedback(partiallyCorrectAnswerToQuestion)).toEqual({
            totalScore: 0, maximumScore: 2, correctAnswers: ['3', '-3']
        })
    })
    test('Correct answer', () => {
        expect(getFeedback(correctAnswerToQuestion)).toEqual({
            totalScore: 2, maximumScore: 2, correctAnswers: ['3', '-3']
        })
    })
})