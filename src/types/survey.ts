// Interfaces

export interface IOption {
    id: number;
    label: string;
    score?: number;
    relatedOptionId?: number;
}

export interface IMatches {
    leftList: IOption[];
    rightList: IOption[];
}

export interface ITextAnswer {
    text: string;
    score?: number;
}

export interface ISurvey {
    id: number;
    title: string;
    questions: IQuestion[];
    isEvaluated: boolean;
}

export interface IQuestion {
    id: number;
    topic: string;
    type: QuestionType;
    required: boolean;
    options?: IOption[] | IMatches;
    correctAnswer?: ITextAnswer;
}

export interface IAnswerToQuestion {
    question: IQuestion;
    answer: IAnswer;
}

export interface SurveyState {
    questions: IQuestion[];
    answersToQuestions: IAnswerToQuestion[];
}

export interface UpdateAnswersQuestionsAction {
    type: SurveyActionTypes.UPDATE_ANSWERS_TO_QUESTIONS;
    payload: IAnswerToQuestion[];
}

export interface UpdateQuestionsAction {
    type: SurveyActionTypes.UPDATE_QUESTIONS;
    payload: IQuestion[];
}

// Enum

export enum QuestionType {
    OneChoice,
    MultipleChoice,
    ShortTextField,
    DetailedTextField,
    Matchmaking   
}

export enum TextFieldType {
    Short,
    Detailed
}

export enum SurveyActionTypes {
    UPDATE_ANSWERS_TO_QUESTIONS = 'UPDATE_ANSWERS_TO_QUESTIONS',
    UPDATE_QUESTIONS = 'UPDATE_QUESTIONS'
}

// Types

export type IAnswer = IOption | IOption[] | ITextAnswer | IMatches;

export type SurveyAction = UpdateAnswersQuestionsAction | UpdateQuestionsAction
