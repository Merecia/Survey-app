import React, { FC, useState, useEffect } from 'react';
import style from './MainPage.module.scss';
import { useNavigate } from 'react-router-dom';
import { ISurvey, ISurveyInfo, SurveyType, SurveyCategory } from '../../types/survey';
import {
    Typography, IconButton, Button,
    TextField, Avatar, List, ListItemButton,
    ListItemIcon, ListItem, ListItemText
} from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import QuizIcon from '@mui/icons-material/Quiz';
import PollIcon from '@mui/icons-material/Poll';
import SurveyCard from '../SurveyCard/SurveyCard';

const MainPage: FC = () => {
    const navigate = useNavigate();
    const [surveys, setSurveys] = useState<ISurveyInfo[] | null>(null);
    const [choicedType, setChoicedType] = useState<SurveyType>(SurveyType.Evaluated);
    const [choicedCategory, setChoicedCategory] = useState<SurveyCategory>(SurveyCategory.Study);
    const [showDropdownMenu, setShowDropdownMenu] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const loadSurveys = () => {
        const surveys = localStorage.getItem('surveys');
        const surveysInfo = surveys ? JSON.parse(surveys).map(
            (survey: ISurvey) => survey.surveyInfo
        ) : null;
        setSurveys(surveysInfo);
    }

    const renderSurveysCards = (surveys: ISurveyInfo[]) => {
        let filteredSurveys: ISurveyInfo[] = surveys;

        if (choicedType === SurveyType.Evaluated) {
            filteredSurveys = surveys.filter(survey => survey.isEvaluated === true);
        } else if (choicedType === SurveyType.Unevaluated) {
            filteredSurveys = surveys.filter(survey => survey.isEvaluated === false);
        }

        filteredSurveys = filteredSurveys.filter(survey => survey.category === choicedCategory);

        if (searchQuery.length !== 0) {
            filteredSurveys = filteredSurveys.filter((survey: ISurveyInfo) => (
                survey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                survey.description.toLowerCase().includes(searchQuery.toLowerCase())
            ));
        }

        if (filteredSurveys.length === 0) {
            return (
                <div className = {style.Message}>
                    <Typography variant={"h6"} component={"h6"} fontWeight={'300'} >
                        There are no surveys with the category and search query you specified.
                    </Typography>
                    <Typography variant={"h6"} component={"h6"} fontWeight={'300'}>
                        Try changing the category or changing the search query.
                    </Typography>
                </div>
            );
        }

        return (
            <div className={style.SurveyCards}>
                { filteredSurveys.map(survey => renderSurveyCard(survey)) }
            </div>
        );
    }

    const renderSurveyCard = (survey: ISurveyInfo) => (
        <SurveyCard
            surveyInfo={survey}
            cssProperties={{ marginBottom: '20px' }}
        />
    )

    const renderCategoriesButtons = (categories: string[]) => {
        return categories.map(category => renderCategoryButton(category));
    }

    const renderCategoryButton = (category: string) => {
        return (
            <Button
                variant={category === choicedCategory ? 'contained' : 'outlined'}
                size="medium"
                sx={{ p: 1.5 }}
                onClick={() =>
                    setChoicedCategory(
                        SurveyCategory[category as keyof typeof SurveyCategory]
                    )
                }
            >
                {category}
            </Button>
        )
    }

    const renderDropdownMenu = () => {
        return (
            <List
                style={{ position: 'absolute', top: '90px', right: '10px', zIndex: '100' }}
                sx={{ bgcolor: 'background.paper' }}
            >
                <ListItem style={{ padding: '5px' }}>
                    <ListItemButton onClick={() => navigate('/survey-constructor')}>
                        <ListItemIcon>
                            <AddCircleOutlineIcon />
                        </ListItemIcon>
                        <ListItemText primary="Create a survey" />
                    </ListItemButton>
                </ListItem>
            </List>
        );
    }

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
                    <div className={style.Surveys} onClick={() => setChoicedType(SurveyType.Unevaluated)}>
                        <Typography
                            variant={"h6"}
                            component={"h6"}
                            sx={{ marginRight: '10px' }}
                            color={choicedType === SurveyType.Unevaluated ? 'black' : '#e0e0e0'}
                        >
                            Surveys
                        </Typography>
                        <PollIcon
                            style={{ fill: choicedType === SurveyType.Unevaluated ? 'black' : '#e0e0e0' }}
                        />
                    </div>
                    <div className={style.Quizes} onClick={() => setChoicedType(SurveyType.Evaluated)}>
                        <Typography
                            variant={"h6"}
                            component={"h6"}
                            sx={{ marginRight: '10px' }}
                            color={choicedType === SurveyType.Evaluated ? 'black' : '#e0e0e0'}
                        >
                            Quizes
                        </Typography>
                        <QuizIcon
                            style={{ fill: choicedType === SurveyType.Evaluated ? 'black' : '#e0e0e0' }}
                        />
                    </div>
                </div>
                <div className={style.Avatar_DropdownMenu}>
                    <Avatar
                        src="/broken-image.jpg"
                        onClick={() => setShowDropdownMenu(!showDropdownMenu)}
                        className={style.Avatar}
                    />
                    {showDropdownMenu && renderDropdownMenu()}
                </div>
            </div>
            <div className={style.Categories}>
                {renderCategoriesButtons(Object.keys(SurveyCategory))}
            </div>

            {surveys && renderSurveysCards(surveys)}
        </div>
    );
}

export default MainPage;