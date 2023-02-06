import { IMatches, IOption, IQuestion, ISurvey, QuestionType } from "../types/survey";

// ----------------------------------------------------------------

export const options1 = [
    { id: 1, label: 'Blue', score: 1 },
    { id: 2, label: 'Red', score: 0 },
    { id: 3, label: 'Green', score: 0 },
    { id: 4, label: 'White', score: 0 }
];

export const options2 = [
    { id: 1, label: '5', score: 1 },
    { id: 2, label: '-5', score: 1 },
    { id: 3, label: '6', score: 0 }
];

// ----------------------------------------------------------------

export const surveyQuestion1: IQuestion = {
    id: 1,
    type: QuestionType.OneChoice,
    topic: 'There is only one the right option',
    options: options1,
};

export const surveyQuestion2: IQuestion = {
    id: 2,
    type: QuestionType.MultipleChoice,
    topic: 'Choose a few of the right options',
    options: options2,
};

export const surveyQuestion3: IQuestion = {
    id: 3,
    type: QuestionType.ShortTextField,
    topic: 'What is your name?',
};

export const surveyQuestion4: IQuestion = {
    id: 4,
    topic: 'Write a small essay about your attitude to smoke',
    type: QuestionType.DetailedTextField
};

export const surveyQuestions: IQuestion[] = [
    surveyQuestion1,
    surveyQuestion2,
    surveyQuestion3,
    surveyQuestion4
];

export const survey: ISurvey = {
    id: 1,
    title: 'Опрос',
    questions: surveyQuestions,
    isEvaluated: false
}

// ----------------------------------------------------------------

export const testQuestion1: IQuestion = {
    id: 1,
    topic: 'What color is the sky?',
    options: options1,
    type: QuestionType.OneChoice
};

export const testQuestion2: IQuestion = {
    id: 2,
    topic: '|x| = 5',
    options: options2,
    type: QuestionType.MultipleChoice
};

export const correctAnswer = {
    text: 'Саша',
    score: 1
}

export const testQuestion3: IQuestion = {
    id: 3,
    topic: 'What is your name?',
    correctAnswer,
    type: QuestionType.ShortTextField
};

const leftList: IOption[] = [
    {id: 1, label: 'Красный'},
    {id: 2, label: 'Синий'},
    {id: 3, label: 'Оранжевый'}
];

const rightList: IOption[] = [
    {id: 1, label: 'Blue'},
    {id: 2, label: 'Red'},
    {id: 3, label: 'Orange'},
    {id: 4, label: 'Purple'}
]

export const matches: IMatches = {
    leftList,
    rightList
}
export const testQuestion4: IQuestion = {
    id: 4,
    topic: 'Choose correct translate',
    options: matches,
    type: QuestionType.Matchmaking
}

export const testQuestions: IQuestion[] = [
    testQuestion1,
    testQuestion2,
    testQuestion3,
    testQuestion4
];

export const test: ISurvey = {
    id: 2,
    title: 'Тест',
    questions: testQuestions,
    isEvaluated: true
}



