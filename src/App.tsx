import { FC, useEffect } from 'react';
import style from './App.module.scss';
import Survey from './pages/Survey/Survey';
import {Route, Routes, useNavigate, Navigate} from 'react-router-dom';
import SurveyConstructor from './pages/SurveyConstructor/SurveyConstructor';
import SurveyAnswers from './pages/SurveyAnswers/SurveyAnswers';
import MainPage from './pages/MainPage/MainPage';
import Auth from './components/Auth/Auth';
import { auth } from './firebase';
import { useActions } from './hooks/useActions';
import { useTypedSelector } from './hooks/useTypedSelector';

const App: FC = () => {
  const {updateUser} = useActions();
  const {user} = useTypedSelector(state => state.survey);
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        updateUser({
          uid: authUser.uid,
          displayName: authUser.displayName || ''
        });
      } else {
        updateUser(null);
      }
    })
  }, []);

  return (
    <div className={style.App}>
      <Routes>
        <Route path = '' element = {<MainPage />} />
        <Route path = '/survey/:id' element = {<Survey />} />
        <Route path = '/survey-answers/:id' element = {<SurveyAnswers />} />
        <Route 
          path = '/survey-constructor' 
          element = { user?.uid ? <SurveyConstructor /> : <Navigate to = '/' /> } 
        />
        <Route 
          path = '/survey-constructor/:id' 
          element = { user?.uid ? <SurveyConstructor /> : <Navigate to = '/' /> } 
        />
        <Route path = '/auth' element = {<Auth />} />
      </Routes>
    </div>
  );
}

export default App;
