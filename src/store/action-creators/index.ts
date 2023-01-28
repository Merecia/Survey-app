import * as TodoActionCreators from './todo';
import * as SurveyActionCreators from './survey';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    ...TodoActionCreators,
    ...SurveyActionCreators
}