import { calculateMaximumScore } from "../helper";
import { IQuestion, ITextAnswer, QuestionType } from "../types/survey";

const questionsWithoutCorrectAnswers: IQuestion[] = [
    { 
        id: 1, topic: 'Квадратний корінь із 196', type: QuestionType.ShortTextField, required: true,
    }, 
    {
        id: 2, topic: 'Столиця Іспанії', type: QuestionType.OneChoice,
        required: true, options: [{id: 1, label: 'Мадрид'}, {id: 2, label: 'Пекін'}]
    }
];

const questionsWithAnswersWithNegativeScore: IQuestion[] = [
    {
        id: 1, topic: 'Квадратний корінь із 196', type: QuestionType.ShortTextField,
        required: true, correctAnswer: {text: '13', ignoreRegister: true, score: -1} as ITextAnswer
    },
    {
        id: 2, topic: 'Столиця Іспанії', type: QuestionType.OneChoice,
        required: true, options: [{id: 1, label: 'Токіо', score: -1}, {id: 2, label: 'Пекін', score: -2}]
    }
];

const questionsWithAnswersWithMixedScore: IQuestion[] = [
    {
        id: 1, topic: 'Квадратний корінь із 196', type: QuestionType.ShortTextField,
        required: true, correctAnswer: {text: '14', ignoreRegister: true, score: 1} as ITextAnswer
    },
    {
        id: 2, topic: 'Столиця Іспанії', type: QuestionType.OneChoice,
        required: true, options: [{id: 1, label: 'Мадрид', score: -1}, {id: 2, label: 'Пекін', score: 1}]
    }
]

describe('Calculating the maximum score for a test', () => {
    test('Questions without correct answers', () => {
        expect(calculateMaximumScore(questionsWithoutCorrectAnswers)).toBe(0);
    })
    test('Questions with answers that have only negative score', () => {
        expect(calculateMaximumScore(questionsWithAnswersWithNegativeScore)).toBe(0);
    })
    test('Questions with answers that have both negative and positive score', () => {
        expect(calculateMaximumScore(questionsWithAnswersWithMixedScore)).toBe(2);
    })
})

