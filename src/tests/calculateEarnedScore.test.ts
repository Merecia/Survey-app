import { calculateEarnedScore } from "../helper";
import { IAnswerToQuestion, IOption, IQuestion, ITextAnswer, QuestionType } from "../types/survey";

const option1: IOption = {id: 1, label: 'Бігти', score: 1};
const option2: IOption = {id: 2, label: 'Ходити', score: -1};
const option3: IOption = {id: 3, label: 'Пригати', score: -1};
const option4: IOption = {id: 4, label: 'Керувати', score: 1};
const correctAnswer: ITextAnswer = {text: 'exhausted', score: 1, ignoreRegister: false};

const question1: IQuestion = {
    id: 1, topic: 'Перекладіть слово run', type: QuestionType.MultipleChoice, 
    options:  [option1, option2, option3, option4], required: true
};
const question2: IQuestion = {
    id: 2, topic: `When I finish work, I'm usually ... (exhaust)`, 
    type: QuestionType.ShortTextField, correctAnswer: correctAnswer, required: true
};

const incorrectAnswersToQuestions: IAnswerToQuestion[] = [
    { question: question1, answer: [option2, option3] },
    { question: question2, answer: {text: 'exhausting', score: 0} }
]; 

const partiallyCorrectAnswersToQuestions: IAnswerToQuestion[] = [
    { question: question1, answer: [option1, option2] },
    { question: question2, answer: {text: 'exhausted', score: 1} }
];

const correctAnswersToQuestions: IAnswerToQuestion[] = [
    { question: question1, answer: [option1, option4] },
    { question: question2, answer: {text: 'exhausted', score: 1} }
];

describe('Calculate earned score', () => {
    test('Incorrect answer', () => {
        expect(calculateEarnedScore(incorrectAnswersToQuestions)).toBe(-2);
    })
    test('Partially correct answer', () => {
        expect(calculateEarnedScore(partiallyCorrectAnswersToQuestions)).toBe(1);
    })
    test('Correct answer', () => {
        expect(calculateEarnedScore(correctAnswersToQuestions)).toBe(3);
    })
})