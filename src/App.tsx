import { FC } from 'react';
import style from './App.module.scss';
import Survey from './components/Survey/Survey';

const App: FC = () => {
  return (
    <div className={style.App}>
      <Survey title = {'Опрос'}/>
    </div>
  );
}

export default App;
