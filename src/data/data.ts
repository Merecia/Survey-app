import { IQuestion, ISurvey, QuestionType } from "../types/survey";

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

export const question1: IQuestion = {
    id: 1,
    topic: 'There is only one the right option',
    options: options1,
    type: QuestionType.OneChoice
};

export const question2: IQuestion = {
    id: 2,
    topic: 'Choose a few of the right options',
    options: options2,
    type: QuestionType.MultipleChoice
};

export const question3: IQuestion = {
    id: 3,
    topic: 'What is your name?',
    type: QuestionType.ShortTextField
};

export const question4: IQuestion = {
    id: 4,
    topic: 'Write a small essay about your attitude to smoke',
    type: QuestionType.DetailedTextField
};

export const questions: IQuestion[] = [
    question1,
    question2,
    question3,
    question4
];

export const survey: ISurvey = {
    id: 1,
    title: 'Опрос',
    questions
}

