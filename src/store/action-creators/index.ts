import * as TodoActionCreators from './todo';
import * as SurveyActionCreators from './survey';

export default {
    ...TodoActionCreators,
    ...SurveyActionCreators
}