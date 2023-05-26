import { 
    SurveyState, 
    SurveyAction, 
    SurveyActionTypes 
} from './../../types/survey';

const initialState: SurveyState = {
    questions: [],
    answersToQuestions: [],
    surveyInfo: {
        id: 1, 
        title: '', 
        description: '',
        category: 'Study', 
        imageUrl: '',
        maximumPassingTimeSeconds: undefined,
        isEvaluated: true
    }
    // title: '',
    // description: '',
    // category: 'Study',
    // imageUrl: '',
    // maximumPassingTimeSeconds: undefined,
    // isEvaluated: true
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
        // case SurveyActionTypes.UPDATE_TITLE:
        //     return {
        //         ...state,
        //         title: action.payload
        //     }
        // case SurveyActionTypes.UPDATE_CATEGORY:
        //     return {
        //         ...state,
        //         category: action.payload
        //     }
        // case SurveyActionTypes.UPDATE_DESCRIPTION:
        //     return {
        //         ...state,
        //         description: action.payload
        //     }
        // case SurveyActionTypes.UPDATE_IMAGE_URL:
        //     return {
        //         ...state,
        //         imageUrl: action.payload
        //     }
        // case SurveyActionTypes.UPDATE_IS_EVALUATED:
        //     return {
        //         ...state,
        //         isEvaluated: action.payload
        //     }
        // case SurveyActionTypes.UPDATE_MAXIMUM_PASSING_TIME_SECONDS:
        //     return {
        //         ...state,
        //         maximumPassingTimeSeconds: action.payload
        //     }
        default:
            return state
    }
}