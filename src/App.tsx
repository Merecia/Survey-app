import { FC } from 'react';
import style from './App.module.scss';
import Survey from './components/Survey/Survey';
import { quiz } from './data/data';
import SurveyConstruct from './components/SurveyConstruct/SurveyConstruct';
import { Button } from '@mui/material';
import { ISurvey, ISurveyResults } from './types/survey';
import SurveyAnswers from './components/SurveyAnswers/SurveyAnswers';

const App: FC = () => {
  const surveys = localStorage.getItem('surveys');
  const surveyId = 1;
  const survey = surveys 
    ? JSON.parse(surveys).find((survey: ISurvey) => survey.surveyInfo.id === surveyId) 
    : null;

    const allSurveyResults = localStorage.getItem('allSurveyResults');
    const surveyResultsId = 1;
    const surveyResults = allSurveyResults
      ? JSON.parse(allSurveyResults).find(
        (surveyResults: ISurveyResults) => surveyResults.id ===  surveyResultsId
      )
      : null;

  return (
    <div className={style.App}>
      {/* <Survey survey = {quiz} /> */}
      {/* { survey ? <Survey survey = {survey} /> : null } */}
      {/* <SurveyAnswers surveyResults = {surveyResults}/> */}
      <SurveyConstruct />
      {/* <Button variant = 'contained'> Hello from MUI v5 </Button> */}
    </div>
  );
}

export default App;
