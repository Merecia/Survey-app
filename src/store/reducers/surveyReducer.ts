import { SurveyState, SurveyAction, SurveyActionTypes } from './../../types/survey';

const initialState: SurveyState = {
    answers: []
}

export const surveyReducer = (state = initialState, action: SurveyAction): SurveyState => {
    switch (action.type) {
        case SurveyActionTypes.UPDATE_ANSWERS:
            return {
                ...state,
                answers: action.payload
            }
        default:
            return state
    }
}