import { calculateMaximumScore } from "../helper";
import { IQuestion, ITextAnswer, QuestionType } from "../types/survey";

const questionsWithoutCorrectAnswers: IQuestion[] = [
    { 
        id: 1, topic: 'Квадратний корінь із 196', type: QuestionType.ShortTextField, required: true,
        correctAnswer: {text: '14', ignoreRegister: true, score: 0} as ITextAnswer
    }, 
    {
        id: 2, topic: 'Столиця Іспанії', type: QuestionType.OneChoice, required: true,
        options: [{id: 1, label: 'Мадрид', score: 0}, {id: 2, label: 'Пекін', score: -1}]
    }
];

const questionsWithPenaltiesForWrongAnswers: IQuestion[] = [
    {
        id: 1, topic: 'Квадратний корінь із 196', type: QuestionType.ShortTextField, required: true, 
        correctAnswer: {text: '14', ignoreRegister: true, score: 1} as ITextAnswer
    },
    {
        id: 2, topic: 'Столиця Іспанії', type: QuestionType.OneChoice, required: true, 
        options: [{id: 1, label: 'Мадрид', score: 1}, {id: 2, label: 'Пекін', score: -1}]
    }
];

const questionsWithoutPenaltiesForWrongAnswers: IQuestion[] = [
    {
        id: 1, topic: 'Квадратний корінь із 196', type: QuestionType.ShortTextField, required: true, 
        correctAnswer: {text: '14', ignoreRegister: true, score: 1} as ITextAnswer
    },
    {
        id: 2, topic: 'Столиця Іспанії', type: QuestionType.OneChoice, required: true, 
        options: [{id: 1, label: 'Мадрид', score: 1}, {id: 2, label: 'Пекін', score: 0}]
    }
]

describe('Calculating the maximum score for a test', () => {
    test('Questions without correct answers', () => {
        expect(calculateMaximumScore(questionsWithoutCorrectAnswers)).toBe(0);
    })
    test('Questions with penalties for wrong answers', () => {
        expect(calculateMaximumScore(questionsWithPenaltiesForWrongAnswers)).toBe(2);
    })
    test('Questions without penalties for wrong answers', () => {
        expect(calculateMaximumScore(questionsWithoutPenaltiesForWrongAnswers)).toBe(2);
    })
})

