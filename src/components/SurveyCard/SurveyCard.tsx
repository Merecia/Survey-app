import React, { FC } from 'react';
import style from './SurveyCard.module.scss';
import { ISurveyInfo } from '../../types/survey';
import { Typography, Button } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useNavigate } from 'react-router-dom';

interface ISurveyCardProps {
    surveyInfo: ISurveyInfo;
    cssProperties?: React.CSSProperties;
}

const SurveyCard: FC<ISurveyCardProps> = ({ surveyInfo, cssProperties }) => {
    const navigate = useNavigate();

    return (
        <div className={style.SurveyCard} style={cssProperties}>
            <img
                src={surveyInfo.imageUrl}
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = process.env.REACT_APP_DEFAULT_SURVEY_IMAGE_URL 
                    || 'https://fpprt.ru/wp-content/uploads/2021/02/file.jpg';
                }}
                alt={"SurveyCard"}
                className={style.Image}
            />
            <div className={style.TitleDescription}>
                <Typography
                    variant={"h5"}
                    component={"h5"}
                    sx={{ marginBottom: '20px' }}
                >
                    {surveyInfo.title}
                </Typography>
                <Typography
                    variant={"body1"}
                    component={"p"}
                >
                    {surveyInfo.description}
                </Typography>
            </div>
            <Button
                variant='contained'
                onClick={() => navigate(`/survey/${surveyInfo.id}`)}
                fullWidth
                sx={{
                    padding: '10px',
                    borderBottomLeftRadius: '10px',
                    borderBottomRightRadius: '10px',
                    borderTopLeftRadius: '0px',
                    borderTopRightRadius: '0px'
                }}
            >
                {surveyInfo.isEvaluated ? 'Take the quiz' : 'Take the survey'}
            </Button>
        </div>
    );
}

export default SurveyCard;