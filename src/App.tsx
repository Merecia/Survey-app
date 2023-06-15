import { FC } from 'react';
import style from './App.module.scss';
import Survey from './components/Survey/Survey';
import {Route, Routes} from 'react-router-dom';
import SurveyConstructor from './components/SurveyConstructor/SurveyConstructor';
import SurveyAnswers from './components/SurveyAnswers/SurveyAnswers';
import MainPage from './components/MainPage/MainPage';

const App: FC = () => {
  return (
    <div className={style.App}>
      <Routes>
        <Route path = '' element = {<MainPage />} />
        <Route path = '/survey/:id' element = {<Survey />} />
        <Route path = '/survey-answers/:id' element = {<SurveyAnswers />} />
        <Route path = '/survey-constructor/:id' element = {<SurveyConstructor />} />
        <Route path = '/survey-constructor' element = {<SurveyConstructor />} />
      </Routes>
    </div>
  );
}

export default App;
