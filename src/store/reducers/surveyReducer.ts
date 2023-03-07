import { 
    SurveyState, 
    SurveyAction, 
    SurveyActionTypes 
} from './../../types/survey';

const initialState: SurveyState = {
    questions: [],
    answersToQuestions: []
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
        default:
            return state
    }
}