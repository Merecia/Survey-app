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
        default:
            return state
    }
}