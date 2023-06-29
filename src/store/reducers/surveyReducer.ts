import {
    SurveyState,
    SurveyAction,
    SurveyActionTypes,
    SurveyCategory,
    SurveyType
} from './../../types/survey';

const initialState: SurveyState = {
    questions: [],
    answersToQuestions: [],
    surveyCards: [],
    searchQuery: '',
    choicedType: SurveyType.Evaluated,
    user: null,
    surveyInfo: {
        title: '',
        description: '',
        category: SurveyCategory.Study,
        imageUrl: '',
        maximumPassingTimeSeconds: undefined,
        maximumScore: undefined,
        isEvaluated: false
    },
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
        case SurveyActionTypes.FETCH_START:
            return {
                ...state,
                loading: true
            }
        case SurveyActionTypes.FETCH_ERROR:
            return {
                ...state,
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
                answersToQuestions: action.payload.answersToQuestions,
                surveyInfo: action.payload.surveyInfo
            }
        default:
            return state
    }
}