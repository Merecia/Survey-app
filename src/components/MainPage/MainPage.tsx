import React, { FC, useState, useEffect } from 'react';
import style from './MainPage.module.scss';
import { useNavigate } from 'react-router-dom';
import { ISurvey, ISurveyInfo, SurveyType,  } from '../../types/survey';
import { Typography } from '@mui/material';
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import SurveyCard from '../SurveyCard/SurveyCard';
import QuizIcon from '@mui/icons-material/Quiz';
import PollIcon from '@mui/icons-material/Poll';

const MainPage: FC = () => {
    const navigate = useNavigate();
    const [surveys, setSurveys] = useState<ISurveyInfo[] | null>(null);
    const [type, setType] = useState<SurveyType>('Surveys');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const loadSurveys = () => {
        const surveys = localStorage.getItem('surveys');
        const surveysInfo = surveys ? JSON.parse(surveys).map(
            (survey: ISurvey) => survey.surveyInfo
        ) : null;
        setSurveys(surveysInfo);
    }

    const renderSurveysCards = (surveys: ISurveyInfo[]) => {
        //let filteredSurveys = surveys.filter(survey => survey.category === category);
        let filteredSurveys: ISurveyInfo[] = surveys;

        if (type === 'Quizes') {
            filteredSurveys = surveys.filter(survey => survey.isEvaluated);
        } else if (type === 'Surveys') {
            filteredSurveys = surveys.filter(survey => !survey.isEvaluated);
        }

        if (searchQuery.length !== 0) {
            filteredSurveys = filteredSurveys.filter((survey: ISurveyInfo) => (
                survey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                survey.description.toLowerCase().includes(searchQuery.toLowerCase())
            ));
        }

        return filteredSurveys.map(survey => renderSurveyCard(survey));
    }

    const renderSurveyCard = (survey: ISurveyInfo) => (
        <SurveyCard
            surveyInfo={survey}
            cssProperties={{ marginBottom: '20px' }}
        />
    )

    const searchbarChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }

    useEffect(() => {
        loadSurveys();
    }, [])

    return (
        <div className={style.MainPage}>
            <div className={style.Header}>
                <Typography
                    variant={"h4"}
                    component={"h4"}
                    className={style.AppName}
                >
                    Survey App
                </Typography>
                <div className={style.Search}>
                    <TextField
                        id="search-bar"
                        className={style.Searchbar}
                        onChange={searchbarChangeHandler}
                        variant="outlined"
                        placeholder="Search..."
                        size="small"
                        sx={{ width: '470px' }}
                    />
                    <IconButton aria-label="search">
                        <SearchIcon style={{ fill: "black" }} />
                    </IconButton>
                </div>
                <div className={style.Types}>
                    <div className={style.Surveys} onClick = {() => setType('Surveys')}>
                        <Typography
                            variant={"h6"}
                            component={"h6"}
                            color={type === 'Surveys' ? 'black' : '#e0e0e0'}
                            sx = {{marginRight: '10px'}}
                        >
                            Surveys
                        </Typography>
                        <PollIcon style={{ fill: type === 'Surveys' ? 'black' : '#e0e0e0' }} />
                    </div>
                    <div className={style.Quizes} onClick = {() => setType('Quizes')}>
                        <Typography
                            variant={"h6"}
                            component={"h6"}
                            sx = {{marginRight: '10px'}}
                            color={type === 'Quizes' ? 'black' : '#e0e0e0'}
                        >
                            Quizes
                        </Typography>
                        <QuizIcon style={{ fill: type === 'Quizes' ? 'black' : '#e0e0e0' }} />
                    </div>
                </div>
            </div>
            <div className={style.SurveyCards}>
                {surveys && renderSurveysCards(surveys)}
            </div>
            <button onClick={() => navigate('/survey-constructor')}>
                Go to Survey Constructor
            </button>
        </div>
    );
}

export default MainPage;