import { surveyReducer } from './surveyReducer';
import {combineReducers} from "redux";

export const rootReducer = combineReducers({
    survey: surveyReducer
})

export type RootState = ReturnType<typeof rootReducer>