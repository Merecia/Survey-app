export interface IOption {
    id: number;
    label: string;
}

export interface ISurvey {
    id: number;
    title: string;
    questions: IQuestion[];
}

export interface IQuestion {
    id: number;
    topic: string;
    options?: IOption | IOption[];
    type: QuestionType;
}

export interface IAnswer {
    id: number;
    question: IQuestion;
    answer: IOption | IOption[] | string;
}

// ---------------------------------------------

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

// ---------------------------------------------

export interface SurveyState {
    answers: IAnswer[];
}

export enum SurveyActionTypes {
    UPDATE_ANSWERS = 'UPDATE_ANSWERS'
}

interface UpdateAnswerAction {
    type: SurveyActionTypes.UPDATE_ANSWERS;
    payload: IAnswer[];
}

export type SurveyAction = 
    UpdateAnswerAction
