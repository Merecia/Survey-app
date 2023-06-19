// Interfaces

export interface IUser {
    uid: string;
    displayName: string;
}

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

export interface IMatch {
    leftListOptionId: number;
    rightListOptionId: number;
}

export interface ITextAnswer {
    text: string;
    score?: number;
    ignoreRegister?: boolean;
}

export interface ISurvey {
    surveyInfo: ISurveyInfo;
    questions: IQuestion[];
}

export interface ISurveyResults {
    id: number;
    surveyInfo: ISurveyInfo;
    passingTimeSeconds: number;
    answersToQuestions: IAnswerToQuestion[];
    earnedScore?: number;
}

export interface IQuestion {
    id: number;
    topic: string;
    type: QuestionType;
    required: boolean;
    options?: IOption[] | IMatches;
    correctAnswer?: ITextAnswer;
}

export interface IFeedback {
    totalScore: number;
    maximumScore: number;
    note: string;
    correctAnswers: string[];
}

export interface IAnswerToQuestion {
    question: IQuestion;
    answer: IAnswer;
}

export interface ISurveyInfo {
    id: number;
    title: string;
    description: string;
    category: SurveyCategory;
    imageUrl: string;
    maximumPassingTimeSeconds?: number;
    maximumScore?: number;
    isEvaluated: boolean;
}

export interface UpdateAnswersQuestionsAction {
    type: SurveyActionTypes.UPDATE_ANSWERS_TO_QUESTIONS;
    payload: IAnswerToQuestion[];
}

export interface UpdateQuestionsAction {
    type: SurveyActionTypes.UPDATE_QUESTIONS;
    payload: IQuestion[];
}

export interface UpdateSurveyInfoAction {
    type: SurveyActionTypes.UPDATE_SURVEY_INFO;
    payload: ISurveyInfo;
}

export interface UpdateSurveyCardsAction {
    type: SurveyActionTypes.UPDATE_SURVEY_CARDS;
    payload: ISurveyInfo[];
}

export interface UpdateUserAction {
    type: SurveyActionTypes.UPDATE_USER;
    payload: IUser | null;
}

export interface SurveyState {
    questions: IQuestion[];
    answersToQuestions: IAnswerToQuestion[];
    surveyCards: ISurveyInfo[];
    surveyInfo: ISurveyInfo;
    user: IUser | null;
}

// Enum

export enum QuestionType {
    OneChoice,
    MultipleChoice,
    ShortTextField,
    DetailedTextField,
    Matchmaking   
}

export enum TextFieldType { Short, Detailed }

export enum SurveyCategory {
    Study = 'Study',
    Psychological = 'Psychological',
    Sociological = 'Sociological',
    Entertainment = 'Entertainment'
}

export enum SurveyType { 
    Evaluated = 'Evaluated', 
    Unevaluated = 'Unevaluated' 
}

export enum SurveyConstructorType {
    Adding = 'Adding',
    Editing = 'Editing'
}

export enum SurveyActionTypes {
    UPDATE_ANSWERS_TO_QUESTIONS = 'UPDATE_ANSWERS_TO_QUESTIONS',
    UPDATE_QUESTIONS = 'UPDATE_QUESTIONS',
    UPDATE_SURVEY_INFO = 'UPDATE_SURVEY_INFO',
    UPDATE_SURVEY_CARDS = 'UPDATE_SURVEY_CARDS',
    UPDATE_USER = 'UPDATE_USER'
}

// Types

export type IAnswer = IOption | IOption[] | ITextAnswer | IMatches;
export type SurveyAction = 
    UpdateAnswersQuestionsAction 
    | UpdateQuestionsAction 
    | UpdateSurveyInfoAction 
    | UpdateSurveyCardsAction
    | UpdateUserAction
