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
    id: string;
    userId: string;
    surveyInfo: ISurveyInfo;
    questions: IQuestion[];
}

export interface ISurveyCard {
    id: string;
    userId: string;
    surveyInfo: ISurveyInfo;
}

export interface ISurveyResults {
    id: string;
    surveyId: string;
    answersToQuestions: IAnswerToQuestion[];
    surveyInfo: ISurveyInfo;
    passingTime: string;
    completionDate: string;
    user?: IUser;
    earnedScore?: number;
    correctAnswersRate?: number;
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
    title: string;
    description: string;
    category: SurveyCategory;
    imageUrl: string;
    maximumPassingTimeSeconds?: number;
    maximumScore?: number;
    isEvaluated: boolean;
    creationDate: string;
}

export interface ICompletionStatistics {
    id: string;
    completionDate: string;
    passingTime?: string;
    maximumPassingTime?: string;
    earnedScore?: number;
    maximumScore?: number;
    correctAnswersRate?: number;
    user?: IUser;
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
    payload: ISurveyCard[];
}

export interface UpdateSearchQueryAction {
    type: SurveyActionTypes.UPDATE_SEARCH_QUERY;
    payload: string;
}

export interface UpdateChoicedTypeAction {
    type: SurveyActionTypes.UPDATE_CHOICED_TYPE;
    payload: SurveyType;
}

export interface UpdateChoicedCategoryAction {
    type: SurveyActionTypes.UPDATE_CHOICED_CATEGORY;
    payload: SurveyCategory;
}

export interface UpdateSurveyStatisticsAction {
    type: SurveyActionTypes.UPDATE_SURVEY_STATISTICS;
    payload: ICompletionStatistics[];
}

export interface UpdateUserAction {
    type: SurveyActionTypes.UPDATE_USER;
    payload: IUser | null;
}

export interface FetchStartAction {
    type: SurveyActionTypes.FETCH_START;
}

export interface FetchErrorAction {
    type: SurveyActionTypes.FETCH_ERROR;
    payload: string;
}

export interface FetchSurveyCardsSuccessAction {
    type: SurveyActionTypes.FETCH_SURVEY_CARDS_SUCCESS;
    payload: ISurveyCard[];
}

export interface FetchSurveySuccessAction {
    type: SurveyActionTypes.FETCH_SURVEY_SUCCESS;
    payload: ISurvey;
}

export interface FetchSurveyResultsSuccessAction {
    type: SurveyActionTypes.FETCH_SURVEY_RESULTS_SUCCESS;
    payload: ISurveyResults;
}

export interface FetchSurveyStatisticsSuccessAction {
    type: SurveyActionTypes.FETCH_SURVEY_STATISTICS_SUCCESS;
    payload: ICompletionStatistics[];
}

export interface ClearSurveyAction {
    type: SurveyActionTypes.CLEAR_SURVEY;
}

export interface SurveyState {
    questions: IQuestion[];
    answersToQuestions: IAnswerToQuestion[];
    surveyStatistics: ICompletionStatistics[];
    surveyResults: ISurveyResults | null;
    searchQuery: string;
    choicedType: SurveyType;
    choicedCategory: SurveyCategory;
    surveyCards: ISurveyCard[];
    surveyInfo: ISurveyInfo;
    user: IUser | null;
    loading: boolean;
    error: null | string;
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
    UPDATE_SURVEY_STATISTICS = 'UPDATE_SURVEY_STATISTICS',
    UPDATE_USER = 'UPDATE_USER',
    UPDATE_SEARCH_QUERY = 'UPDATE_SEARCH_QUERY',
    UPDATE_CHOICED_TYPE = 'UPDATE_CHOICED_TYPE',
    UPDATE_CHOICED_CATEGORY = 'UPDATE_CHOICED_CATEGORY',
    FETCH_START = 'FETCH_START',
    FETCH_ERROR = 'FETCH_ERROR',
    FETCH_SURVEY_SUCCESS = 'FETCH_SURVEY_SUCCESS',
    FETCH_SURVEY_CARDS_SUCCESS = 'FETCH_SURVEY_CARDS_SUCCESS',
    FETCH_SURVEY_RESULTS_SUCCESS = 'FETCH_SURVEY_RESULTS_SUCCESS',
    FETCH_SURVEY_STATISTICS_SUCCESS = 'FETCH_SURVEY_STATISTICS_SUCCESS',
    CLEAR_SURVEY = 'CLEAR_SURVEY'
}

// Types

export type IAnswer = IOption | IOption[] | ITextAnswer | IMatches;

export type SurveyAction = 
    UpdateAnswersQuestionsAction 
    | UpdateQuestionsAction 
    | UpdateSurveyInfoAction 
    | UpdateSurveyCardsAction
    | UpdateUserAction
    | UpdateSearchQueryAction
    | UpdateChoicedTypeAction
    | UpdateChoicedCategoryAction
    | UpdateSurveyStatisticsAction
    | FetchStartAction
    | FetchErrorAction
    | FetchSurveyCardsSuccessAction
    | FetchSurveySuccessAction
    | FetchSurveyResultsSuccessAction
    | FetchSurveyStatisticsSuccessAction
    | ClearSurveyAction
    