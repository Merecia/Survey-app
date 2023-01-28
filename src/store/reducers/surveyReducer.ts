import { SurveyState, SurveyAction, SurveyActionTypes } from './../../types/survey';

const initialState: SurveyState = {
    answersQuestions: []
}

export const surveyReducer = (state = initialState, action: SurveyAction): SurveyState => {
    switch (action.type) {
        case SurveyActionTypes.UPDATE_ANSWERS_QUESTIONS:
            return {
                ...state,
                answersQuestions: action.payload
            }
        default:
            return state
    }
}