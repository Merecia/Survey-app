import { FC } from 'react';
import style from './App.module.scss';
import Survey from './components/Survey/Survey';
import {Route, Routes} from 'react-router-dom';
import SurveyConstruct from './components/SurveyConstruct/SurveyConstruct';
import SurveyAnswers from './components/SurveyAnswers/SurveyAnswers';
import MainPage from './components/MainPage/MainPage';

const App: FC = () => {
  return (
    <div className={style.App}>
      <Routes>
        <Route path = '' element = {<MainPage />} />
        <Route path = '/survey/:id' element = {<Survey />} />
        <Route path = '/survey-results/:id' element = {<SurveyAnswers />} />
        <Route path = '/survey-constructor' element = {<SurveyConstruct />} />
      </Routes>
    </div>
  );
}

export default App;
