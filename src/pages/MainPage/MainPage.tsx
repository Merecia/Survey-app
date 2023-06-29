import { FC, useState, useEffect } from 'react';
import style from './MainPage.module.scss';
import { SurveyType, SurveyCategory, ISurveyCard } from '../../types/survey';
import { Typography, Button, CircularProgress } from '@mui/material';
import SurveyCard from '../../components/SurveyCard/SurveyCard';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import Header from '../../components/Header/Header';

const MainPage: FC = () => {
    const [choicedCategory, setChoicedCategory] = useState<SurveyCategory>(SurveyCategory.Study);
    const { surveyCards, loading, error, searchQuery, choicedType } = useTypedSelector(state => state.survey);
    const { loadSurveyCards } = useActions();

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
            <Header />
            <div className={style.Categories}>
                {renderCategoriesButtons(Object.keys(SurveyCategory))}
            </div>
            {surveyCards && renderSurveysCards(surveyCards)}
        </div>
    );
}

export default MainPage;