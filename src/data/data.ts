import { IAnswer, IQuestion, QuestionType } from "../types/survey";

export const options1 = [
    { id: 1, label: 'Первый ответ' },
    { id: 2, label: 'Второй ответ' },
    { id: 3, label: 'Третий ответ' },
    { id: 4, label: 'Четвертый ответ' }
];

export const options2 = [
    { id: 1, label: 'Первый ответ' },
    { id: 2, label: 'Второй ответ' },
    { id: 3, label: 'Третий ответ' }
];

export const question: IQuestion = {
    id: 1,
    topic: 'Как дела?',
    type: QuestionType.ShortTextField
}

export const answer: IAnswer = {
    id: 1,
    question: question,
    answer: 'Привет'
}