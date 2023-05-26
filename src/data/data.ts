import { 
    IAnswerToQuestion, 
    IMatches, 
    IOption, 
    IQuestion, 
    ISurvey, 
    ISurveyInfo, 
    QuestionType 
} from "../types/survey";

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
    { id: 3, label: '6', score: -0.5 }
];

// ----------------------------------------------------------------

export const surveyQuestion1: IQuestion = {
    id: 1,
    type: QuestionType.OneChoice,
    required: true,
    topic: 'There is only one the right option',
    options: options1,
};

export const surveyQuestion2: IQuestion = {
    id: 2,
    type: QuestionType.MultipleChoice,
    required: true,
    topic: 'Choose a few of the right options',
    options: options2,
};

export const surveyQuestion3: IQuestion = {
    id: 3,
    type: QuestionType.ShortTextField,
    required: true,
    topic: 'What is your name?',
};

export const surveyQuestion4: IQuestion = {
    id: 4,
    topic: 'Write a small essay about your attitude to smoke',
    required: true,
    type: QuestionType.DetailedTextField
};

export const surveyQuestions: IQuestion[] = [
    surveyQuestion1,
    surveyQuestion2,
    surveyQuestion3,
    surveyQuestion4
];

const surveyInfo: ISurveyInfo = {
    id: 1,
    title: 'Опрос',
    category: 'Study',
    imageUrl: '',
    isEvaluated: false,
    description: 'description'
}

export const survey: ISurvey = {
    surveyInfo: surveyInfo,
    questions: surveyQuestions
}

// ----------------------------------------------------------------

export const testQuestion1: IQuestion = {
    id: 1,
    required: true,
    topic: 'What color is the sky?',
    options: options1,
    type: QuestionType.OneChoice
};

export const testQuestion2: IQuestion = {
    id: 2,
    required: true,
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
    required: true,
    topic: 'What is your name?',
    correctAnswer,
    type: QuestionType.ShortTextField
};

const leftList: IOption[] = [
    {id: 1, label: 'Красный', score: 1, relatedOptionId: 2},
    {id: 2, label: 'Синий', score: 1, relatedOptionId: 1},
    {id: 3, label: 'Оранжевый', score: 1, relatedOptionId: 3}
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
    required: true,
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

const testInfo: ISurveyInfo = {
    id: 1,
    title: 'Опрос',
    category: 'Study',
    imageUrl: '',
    isEvaluated: false,
    description: 'description'
}

export const quiz: ISurvey = {
    surveyInfo: testInfo,
    questions: testQuestions
}

export const answers: IAnswerToQuestion[] = [
    {
        "question": {
            "id": 1,
            "topic": "What color is the sky?",
            "required": true,
            "options": [
                {
                    "id": 1,
                    "label": "Blue",
                    "score": 1
                },
                {
                    "id": 2,
                    "label": "Red",
                    "score": 0
                },
                {
                    "id": 3,
                    "label": "Green",
                    "score": 0
                },
                {
                    "id": 4,
                    "label": "White",
                    "score": 0
                }
            ],
            "type": 0
        },
        "answer": {
            "id": 1,
            "label": "Blue",
            "score": 1
        }
    },
    {
        "question": {
            "id": 2,
            "topic": "|x| = 5",
            "options": [
                {
                    "id": 1,
                    "label": "x = 5",
                    "score": 1
                },
                {
                    "id": 2,
                    "label": "x = -5",
                    "score": 1
                },
                {
                    "id": 3,
                    "label": "x = 6",
                    "score": -0.5
                }
            ],
            "required": true,
            "type": 1
        },
        "answer": [
            {
                "id": 2,
                "label": "-5",
                "score": 1
            },
            {
                "id": 3,
                "label": "6",
                "score": -0.5
            }
        ]
    },
    {
        "question": {
            "id": 3,
            "topic": "What is your name?",
            "type": 2,
            "correctAnswer": {
                "text": "Саша",
                "score": 1
            },
            "required": true
        },
        "answer": {
            "text": "Oleg",
            "score": 0
        }
    },
    {
        "answer": {
            "leftList": [
                {
                    "id": 1,
                    "label": "Красный",
                    "score": 1,
                    "relatedOptionId": 2
                },
                {
                    "id": 2,
                    "label": "Синий",
                    "score": 0,
                    "relatedOptionId": 4
                },
                {
                    "id": 3,
                    "label": "Оранжевый",
                    "score": 0,
                    "relatedOptionId": 1
                }
            ],
            "rightList": [
                {
                    "id": 1,
                    "label": "Blue"
                },
                {
                    "id": 2,
                    "label": "Red"
                },
                {
                    "id": 3,
                    "label": "Orange"
                },
                {
                    "id": 4,
                    "label": "Purple"
                }
            ]
        },
        "question": {
            "id": 4,
            "topic": "Choose correct translate",
            "required": true,
            "options": {
                "leftList": [
                    {
                        "id": 1,
                        "label": "Красный",
                        "score": 1,
                        "relatedOptionId": 2
                    },
                    {
                        "id": 2,
                        "label": "Синий",
                        "score": 1,
                        "relatedOptionId": 1
                    },
                    {
                        "id": 3,
                        "label": "Оранжевый",
                        "score": 1,
                        "relatedOptionId": 3
                    }
                ],
                "rightList": [
                    {
                        "id": 1,
                        "label": "Blue"
                    },
                    {
                        "id": 2,
                        "label": "Red"
                    },
                    {
                        "id": 3,
                        "label": "Orange"
                    },
                    {
                        "id": 4,
                        "label": "Purple"
                    }
                ]
            },
            "type": 4
        }
    }
]


