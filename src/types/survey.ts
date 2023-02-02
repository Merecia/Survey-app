// Interfaces

export interface IOption {
    id: number;
    label: string;
    score?: number;
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
    options?: IOption[];
    correctAnswer?: ITextAnswer;
    type: QuestionType;
}

export interface IAnswerQuestion {
    question: IQuestion;
    answer: Answer;
}

export interface SurveyState {
    answersQuestions: IAnswerQuestion[];
}

export interface UpdateAnswersQuestionsAction {
    type: SurveyActionTypes.UPDATE_ANSWERS_QUESTIONS;
    payload: IAnswerQuestion[];
}

// Enum

export enum QuestionType {
    OneChoice,
    MultipleChoice,
    ShortTextField,
    DetailedTextField    
}

export enum TextFieldType {
    Short,
    Detailed
}

export enum SurveyActionTypes {
    UPDATE_ANSWERS_QUESTIONS = 'UPDATE_ANSWERS_QUESTIONS'
}

// Types

export type Answer = IOption | IOption[] | ITextAnswer;

export type SurveyAction = UpdateAnswersQuestionsAction
