import {
    SurveyState,
    SurveyAction,
    SurveyActionTypes,
    SurveyCategory,
    SurveyType,
    ISurveyInfo
} from './../../types/survey';

const initialSurveyInfo: ISurveyInfo = {
    title: '',
    description: '',
    category: SurveyCategory.Study,
    imageUrl: '',
    maximumPassingTimeSeconds: undefined,
    maximumScore: undefined,
    isEvaluated: false
}

const initialState: SurveyState = {
    questions: [],
    answersToQuestions: [],
    surveyCards: [],
    surveyResults: null,
    surveyStatistics: [],
    searchQuery: '',
    choicedType: SurveyType.Evaluated,
    user: null,
    surveyInfo: initialSurveyInfo,
    loading: false,
    error: null
}

export const surveyReducer = (state = initialState, action: SurveyAction): SurveyState => {
    switch (action.type) {
        case SurveyActionTypes.UPDATE_ANSWERS_TO_QUESTIONS:
            return {
                ...state,
                answersToQuestions: action.payload
            }
        case SurveyActionTypes.UPDATE_QUESTIONS:
            return {
                ...state,
                questions: action.payload
            }
        case SurveyActionTypes.UPDATE_SURVEY_INFO:
            return {
                ...state,
                surveyInfo: action.payload
            }
        case SurveyActionTypes.UPDATE_SURVEY_CARDS:
            return {
                ...state,
                surveyCards: action.payload
            }
        case SurveyActionTypes.UPDATE_USER:
            return {
                ...state,
                user: action.payload
            }
        case SurveyActionTypes.UPDATE_SEARCH_QUERY:
            return {
                ...state,
                searchQuery: action.payload
            }
        case SurveyActionTypes.UPDATE_CHOICED_TYPE:
            return {
                ...state,
                choicedType: action.payload
            }
        case SurveyActionTypes.UPDATE_SURVEY_STATISTICS:
            return {
                ...state,
                surveyStatistics: action.payload
            }
        case SurveyActionTypes.FETCH_START:
            return {
                ...state,
                error: null,
                loading: true
            }
        case SurveyActionTypes.FETCH_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case SurveyActionTypes.FETCH_SURVEY_CARDS_SUCCESS:
            return {
                ...state,
                loading: false,
                surveyCards: action.payload
            }
        case SurveyActionTypes.FETCH_SURVEY_SUCCESS:
            return {
                ...state,
                surveyInfo: action.payload.surveyInfo,
                questions: action.payload.questions,
                loading: false
            }
        case SurveyActionTypes.FETCH_SURVEY_RESULTS_SUCCESS:
            return {
                ...state,
                loading: false,
                surveyResults: action.payload
            }
        case SurveyActionTypes.FETCH_SURVEY_STATISTICS_SUCCESS:
            return {
                ...state,
                loading: false,
                surveyStatistics: action.payload
            }
        default:
            return state
    }
}