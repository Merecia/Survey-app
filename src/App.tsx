import { FC } from 'react';
import style from './App.module.scss';
import Survey from './components/Survey/Survey';
import { quiz } from './data/data';
import SurveyConstruct from './components/SurveyConstruct/SurveyConstruct';
import { Button } from '@mui/material';
import { ISurvey, ISurveyResults } from './types/survey';
import SurveyAnswers from './components/SurveyAnswers/SurveyAnswers';

const App: FC = () => {
  return (
    <div className={style.App}>
      { <Survey id = {1} /> }
      {/* <Survey survey = {quiz} /> */}
      {/* <SurveyAnswers surveyResults = {surveyResults}/> */}
      {/* <SurveyConstruct /> */}
      {/* <Button variant = 'contained'> Hello from MUI v5 </Button> */}
    </div>
  );
}

export default App;
