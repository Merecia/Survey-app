// Interfaces

export interface IOption {
    id: number;
    label: string;
    score?: number;
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
    options?: IOption[] | IMatches;
    correctAnswer?: ITextAnswer;
    type: QuestionType;
}

export interface IAnswerToQuestion {
    question: IQuestion;
    answer: Answer;
}

export interface SurveyState {
    answersToQuestions: IAnswerToQuestion[];
}

export interface UpdateAnswersQuestionsAction {
    type: SurveyActionTypes.UPDATE_ANSWERS_TO_QUESTIONS;
    payload: IAnswerToQuestion[];
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
    UPDATE_ANSWERS_TO_QUESTIONS = 'UPDATE_ANSWERS_TO_QUESTIONS'
}

// Types

export type Answer = IOption | IOption[] | ITextAnswer;

export type SurveyAction = UpdateAnswersQuestionsAction
