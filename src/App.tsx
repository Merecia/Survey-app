import { FC } from 'react';
import style from './App.module.scss';
import Survey from './components/Survey/Survey';
import { quiz } from './data/data';

const App: FC = () => {
  return (
    <div className={style.App}>
      <Survey survey = {quiz} />
    </div>
  );
}

export default App;
