import {FC} from 'react';
import style from './MainPage.module.scss';
import { useNavigate } from 'react-router-dom';

const MainPage: FC = () => {
    const navigate = useNavigate();

    return (
        <div className = {style.MainPage}>
            <h1> There will be the main page of the site </h1>
            <button onClick = {() => navigate('/survey-constructor')}> 
                Go to Survey Constructor 
            </button>
        </div>
    );
}

export default MainPage;