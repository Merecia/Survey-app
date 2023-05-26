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
    correctAnswer?: ITextAnswer | IOption | IOption[];
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
    // title: string;
    // description: string;
    // category: Category;
    // imageUrl: string;
    // maximumPassingTimeSeconds: undefined | number;
    // isEvaluated: boolean;
}

export interface ISurveyInfo {
    id: number;
    title: string;
    description: string;
    category: Category;
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

// export interface UpdateTitleAction {
//     type: SurveyActionTypes.UPDATE_TITLE;
//     payload: string;
// }

// export interface UpdateTypeAction {
//     type: SurveyActionTypes.UPDATE_TITLE;
//     payload: string;
// }

// export interface UpdateCategoryAction {
//     type: SurveyActionTypes.UPDATE_CATEGORY;
//     payload: Category;
// }

// export interface UpdateDescriptionAction {
//     type: SurveyActionTypes.UPDATE_DESCRIPTION;
//     payload: string;
// }

// export interface UpdateImageUrlAction {
//     type: SurveyActionTypes.UPDATE_IMAGE_URL;
//     payload: string;
// }

// export interface UpdateMaximumPassingTimeSecondsAction {
//     type: SurveyActionTypes.UPDATE_MAXIMUM_PASSING_TIME_SECONDS;
//     payload: number;
// }

// export interface UpdateIsEvaluated {
//     type: SurveyActionTypes.UPDATE_IS_EVALUATED;
//     payload: boolean;
// }

// Enum

export enum QuestionType {
    OneChoice,
    MultipleChoice,
    ShortTextField,
    DetailedTextField,
    Matchmaking   
}

export enum TextFieldType { Short, Detailed }

export enum SurveyActionTypes {
    UPDATE_ANSWERS_TO_QUESTIONS = 'UPDATE_ANSWERS_TO_QUESTIONS',
    UPDATE_QUESTIONS = 'UPDATE_QUESTIONS',
    UPDATE_SURVEY_INFO = 'UPDATE_SURVEY_INFO',
    // UPDATE_TITLE = 'UPDATE_TITLE',
    // UPDATE_CATEGORY = 'UPDATE_CATEGORY',
    // UPDATE_DESCRIPTION = 'UPDATE_DESCRIPTION',
    // UPDATE_IMAGE_URL = 'UPDATE_IMAGE_URL',
    // UPDATE_MAXIMUM_PASSING_TIME_SECONDS = 'UPDATE_MAXIMUM_PASSING_TIME_SECONDS',
    // UPDATE_IS_EVALUATED = 'UPDATE_IS_EVALUATED'
}

// Types

export type IAnswer = IOption | IOption[] | ITextAnswer | IMatches;

export type SurveyAction = UpdateAnswersQuestionsAction | UpdateQuestionsAction | UpdateSurveyInfo
// | UpdateCategoryAction | UpdateTitleAction | UpdateImageUrlAction 
// | UpdateDescriptionAction | UpdateIsEvaluated | UpdateTypeAction 
// | UpdateMaximumPassingTimeSecondsAction

export type Category = 'Study' | 'Psychological' | 'Sociological';
