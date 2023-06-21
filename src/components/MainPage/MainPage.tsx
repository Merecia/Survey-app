import React, { FC, useState, useEffect } from 'react';
import style from './MainPage.module.scss';
import { useNavigate } from 'react-router-dom';
import { SurveyType, SurveyCategory, ISurveyCard } from '../../types/survey';
import {
    Typography, IconButton, Button,
    TextField, Avatar, List, ListItemButton,
    ListItemIcon, ListItem, ListItemText, CircularProgress
} from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import QuizIcon from '@mui/icons-material/Quiz';
import PollIcon from '@mui/icons-material/Poll';
import SurveyCard from '../SurveyCard/SurveyCard';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { stringAvatar } from '../../helper';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

const MainPage: FC = () => {
    const navigate = useNavigate();
    const [choicedType, setChoicedType] = useState<SurveyType>(SurveyType.Evaluated);
    const [choicedCategory, setChoicedCategory] = useState<SurveyCategory>(SurveyCategory.Study);
    const [showDropdownMenu, setShowDropdownMenu] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const { loadSurveyCards, updateUser } = useActions();
    const { surveyCards, user, loading, error } = useTypedSelector(state => state.survey);

    console.log(surveyCards);

    useEffect(() => {
        loadSurveyCards();
    }, [])

    const renderSurveysCards = (surveyCards: ISurveyCard[]) => {
        let filteredSurveyCards: ISurveyCard[] = surveyCards;

        if (choicedType === SurveyType.Evaluated) {
            filteredSurveyCards = surveyCards.filter(surveyCard => surveyCard.surveyInfo.isEvaluated === true);
        } else if (choicedType === SurveyType.Unevaluated) {
            filteredSurveyCards = surveyCards.filter(surveyCard => surveyCard.surveyInfo.isEvaluated === false);
        }

        filteredSurveyCards = filteredSurveyCards.filter(surveyCard => surveyCard.surveyInfo.category === choicedCategory);

        if (searchQuery.length !== 0) {
            filteredSurveyCards = filteredSurveyCards.filter((surveyCard: ISurveyCard) => (
                surveyCard.surveyInfo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                surveyCard.surveyInfo.description.toLowerCase().includes(searchQuery.toLowerCase())
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

    const signOutHandler = () => {
        signOut(auth).then(() => {
            updateUser(null);
            setShowDropdownMenu(false);
        })
    }

    const renderSurveyCard = (surveyCard: ISurveyCard) => (
        <SurveyCard
            key={surveyCard.id}
            surveyCard={surveyCard}
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
                sx={{ bgcolor: 'background.paper' }}
                className = {style.DropdownMenu}
            >
                <ListItem style={{ padding: '5px' }}>
                    <ListItemButton onClick={() => navigate('/survey-constructor')}>
                        <ListItemIcon>
                            <AddCircleOutlineIcon />
                        </ListItemIcon>
                        <ListItemText primary="Create Survey" />
                    </ListItemButton>
                </ListItem>
                <ListItem style={{ padding: '5px' }}>
                    <ListItemButton onClick={signOutHandler}>
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary="Sign Out" />
                    </ListItemButton>
                </ListItem>
            </List>
        );
    }

    const searchbarChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }

    if (loading) {
        return (
            <div className = {style.Loading}>
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <Typography
                variant={"h1"}
                component={"h1"}
                className={style.Error}
            >
                {error}
            </Typography>
        );
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
                    {
                        user 
                        ? <Avatar
                            {...stringAvatar(user.displayName)}
                            onClick={() => setShowDropdownMenu(!showDropdownMenu)}
                            className={style.Avatar}
                        />
                        : <Typography
                            variant={"h6"}
                            component={"h6"}
                            onClick={() => navigate('./auth')}
                            style = {{ cursor: 'pointer' }}
                        >
                            Sign in
                        </Typography>
                    }
                    
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