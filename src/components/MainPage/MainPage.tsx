import React, { FC, useState, useEffect } from 'react';
import style from './MainPage.module.scss';
import { useNavigate } from 'react-router-dom';
import { ISurveyInfo, SurveyType, SurveyCategory } from '../../types/survey';
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
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';

const MainPage: FC = () => {
    const navigate = useNavigate();
    const [choicedType, setChoicedType] = useState<SurveyType>(SurveyType.Evaluated);
    const [choicedCategory, setChoicedCategory] = useState<SurveyCategory>(SurveyCategory.Study);
    const [showDropdownMenu, setShowDropdownMenu] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const { loadSurveyCards } = useActions();
    const { surveyCards } = useTypedSelector(state => state.survey);

    console.log(surveyCards);

    useEffect(() => {
        loadSurveyCards();
    }, [])

    const renderSurveysCards = (surveyCards: ISurveyInfo[]) => {
        let filteredSurveyCards: ISurveyInfo[] = surveyCards;

        if (choicedType === SurveyType.Evaluated) {
            filteredSurveyCards = surveyCards.filter(surveyCard => surveyCard.isEvaluated === true);
        } else if (choicedType === SurveyType.Unevaluated) {
            filteredSurveyCards = surveyCards.filter(surveyCard => surveyCard.isEvaluated === false);
        }

        filteredSurveyCards = filteredSurveyCards.filter(surveyCard => surveyCard.category === choicedCategory);

        if (searchQuery.length !== 0) {
            filteredSurveyCards = filteredSurveyCards.filter((surveyCard: ISurveyInfo) => (
                surveyCard.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                surveyCard.description.toLowerCase().includes(searchQuery.toLowerCase())
            ));
        }

        if (filteredSurveyCards.length === 0) {
            return (
                <div className={style.Message}>
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
                {filteredSurveyCards.map(surveyCard => renderSurveyCard(surveyCard))}
            </div>
        );
    }

    const renderSurveyCard = (survey: ISurveyInfo) => (
        <SurveyCard
            key={survey.id}
            surveyInfo={survey}
            cssProperties={{ marginBottom: '20px' }}
        />
    )

    const renderCategoriesButtons = (categories: string[]) => {
        return categories.map((category, index) => renderCategoryButton(category, index));
    }

    const renderCategoryButton = (category: string, index: number) => {
        return (
            <Button
                key={index}
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
                // style={{ position: 'absolute', top: '90px', right: '10px', zIndex: '100' }}
                sx={{ bgcolor: 'background.paper' }}
                className = {style.DropdownMenu}
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

            {surveyCards && renderSurveysCards(surveyCards)}
        </div>
    );
}

export default MainPage;