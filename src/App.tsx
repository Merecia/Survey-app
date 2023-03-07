import { FC } from 'react';
import style from './App.module.scss';
// import Survey from './components/Survey/Survey';
import SurveyAnswers from './components/SurveyAnswers/SurveyAnswers';

const App: FC = () => {
  return (
    <div className={style.App}>
      {/* <Survey 
        id = {1} 
        title = {'Опрос'}
      /> */}

      <SurveyAnswers 
        id = {1}
        title = {'Ответы'}
      />
    </div>
  );
}

export default App;
