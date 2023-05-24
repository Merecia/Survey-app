import { FC } from 'react';
import style from './App.module.scss';
import Survey from './components/Survey/Survey';
import { quiz } from './data/data';
import SurveyConstruct from './components/SurveyConstruct/SurveyConstruct';

const App: FC = () => {
  return (
    <div className={style.App}>
      {/* <Survey survey = {quiz} /> */}
      <SurveyConstruct />
    </div>
  );
}

export default App;
