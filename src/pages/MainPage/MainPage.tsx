import { FC, useEffect } from 'react';
import { SurveyCategory, ISurveyCard } from '../../types/survey';
import { Typography, Button, CircularProgress } from '@mui/material';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import Header from '../../components/Header/Header';
import SurveyCard from '../../components/SurveyCard/SurveyCard';
import style from './MainPage.module.scss';

const MainPage: FC = () => {
    const { surveyCards, loading, error, choicedCategory, searchQuery } = useTypedSelector(state => state.survey);
    const { loadSurveyCards, loadMoreSurveyCards, updateChoicedCategory } = useActions();

    useEffect(() => {
        loadSurveyCards();
    }, [])

    const renderSurveysCards = (surveyCards: ISurveyCard[]) => {
        let filteredSurveyCards: ISurveyCard[] = surveyCards;

        if (searchQuery.length !== 0) {
            filteredSurveyCards = filteredSurveyCards.filter((surveyCard: ISurveyCard) => (
                surveyCard.surveyInfo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                surveyCard.surveyInfo.description.toLowerCase().includes(searchQuery.toLowerCase())
            ));
        }

        return (
            <div className={style.SurveyCards}>
                { filteredSurveyCards.map(surveyCard => renderSurveyCard(surveyCard)) }
            </div>
        );
    }

    const renderSurveyCard = (surveyCard: ISurveyCard) => {
        return (
            <SurveyCard
                key={surveyCard.id}
                surveyCard={surveyCard}
                cssProperties={{ marginBottom: '20px' }}
            />
        );
    }
        

    const renderCategoriesButtons = (categories: string[]) => {
        return (
            <div className={style.Categories}>
                { 
                    categories.map((category, index) => 
                        renderCategoryButton(category, index)
                    ) 
                }
            </div>
        );
    }


    const categoryButtonClickHandler = (category: string) => {
        updateChoicedCategory(SurveyCategory[category as keyof typeof SurveyCategory]);
        loadSurveyCards();
    }

    const renderCategoryButton = (category: string, index: number) => {
        return (
            <Button
                key={index}
                variant={category === choicedCategory ? 'contained' : 'outlined'}
                size='medium'
                sx={{ p: 1.5 }}
                onClick={() => categoryButtonClickHandler(category)}
            >
                {category}
            </Button>
        );
    }

    const renderLoading = () => {
        return (
            <div className={style.Loading}>
                <CircularProgress />
            </div>
        );
    }

    const renderError = (error: string) => {
        return (
            <div className={style.Error}>
                <Typography
                    variant={'h3'}
                    component={'h3'}
                >
                    {error}
                </Typography>
            </div>
        );
    }

    const renderLoadingMoreButton = () => {
        return (
            <div className = {style.LoadingMoreButton}>
                <Button
                    variant={'outlined'}
                    size='large'
                    sx={{ width: '30%' }}
                    onClick={async () => loadMoreSurveyCards()}
                    className = {style.LoadingMoreButton}
                >
                    Load more
                </Button>
            </div>
        );
    }

    return (
        <div className={style.MainPage}>
            <Header />
            { renderCategoriesButtons(Object.keys(SurveyCategory)) }
            { surveyCards && renderSurveysCards(surveyCards) }
            { loading && renderLoading() }
            { error && renderError(error) }
            { !loading && !error && renderLoadingMoreButton() }
        </div>
    );
}

export default MainPage;