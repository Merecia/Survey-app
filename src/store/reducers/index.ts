import { surveyReducer } from './surveyReducer';
import {combineReducers} from "redux";
import {todoReducer} from "./todoReducer";

export const rootReducer = combineReducers({
    todo: todoReducer,
    survey: surveyReducer
})

export type RootState = ReturnType<typeof rootReducer>