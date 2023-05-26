import { FC } from 'react';
import style from './App.module.scss';
import Survey from './components/Survey/Survey';
import { quiz } from './data/data';
import SurveyConstruct from './components/SurveyConstruct/SurveyConstruct';
import { Button } from '@mui/material';

const App: FC = () => {
  return (
    <div className={style.App}>
      {/* <Survey survey = {quiz} /> */}
      <SurveyConstruct />
      {/* <Button variant = 'contained'> Hello from MUI v5 </Button> */}
    </div>
  );
}

export default App;
