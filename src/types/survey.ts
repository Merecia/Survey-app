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

export interface SurveyState {
    questions: IQuestion[];
    answersToQuestions: IAnswerToQuestion[];
    surveyInfo: ISurveyInfo;
}

export interface ISurveyInfo {
    id: number;
    title: string;
    description: string;
    category: SurveyCategory;
    imageUrl: string;
    maximumPassingTimeSeconds?: number;
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

export interface UpdateSurveyInfo {
    type: SurveyActionTypes.UPDATE_SURVEY_INFO;
    payload: ISurveyInfo;
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

export enum SurveyActionTypes {
    UPDATE_ANSWERS_TO_QUESTIONS = 'UPDATE_ANSWERS_TO_QUESTIONS',
    UPDATE_QUESTIONS = 'UPDATE_QUESTIONS',
    UPDATE_SURVEY_INFO = 'UPDATE_SURVEY_INFO'
}

// Types

export type IAnswer = IOption | IOption[] | ITextAnswer | IMatches;
export type SurveyAction = UpdateAnswersQuestionsAction | UpdateQuestionsAction | UpdateSurveyInfo

// export type SurveyCategory = 'Study' | 'Psychological' | 'Sociological';
// export type SurveyType = 'Surveys' | 'Quizes';
