import { FC, useEffect, useState } from 'react';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { IAnswerToQuestion, ISurveyInfo, ISurveyResults } from '../../types/survey';
import Answer from '../Answer/Answer';
import style from './SurveyAnswers.module.scss';
import { Typography } from '@mui/material';
import { CircularProgress } from '@mui/material';

interface ISurveyAnswersProps {
    id: number;
}

const SurveyAnswers: FC<ISurveyAnswersProps> = ({ id }) => {
    const { answersToQuestions, surveyInfo } = useTypedSelector(state => state.survey);
    const { updateAnswersToQuestions, updateSurveyInfo } = useActions();
    const [loading, setLoading] = useState(true);

    const loadSurveyAnswers = (id: number) => {
        const allSurveyResults = localStorage.getItem('allSurveyResults');
        const surveyResults = allSurveyResults
            ? JSON.parse(allSurveyResults).find((surveyResults: ISurveyResults) => surveyResults.id === id)
            : null;

        updateAnswersToQuestions(surveyResults.answersToQuestions);
        updateSurveyInfo(surveyResults.surveyInfo);
    }

    useEffect(() => {
        loadSurveyAnswers(id);
        setLoading(false);
        // eslint-disable-next-line
    }, [])

    const renderAnswersToQuestions = (answersToQuestions: IAnswerToQuestion[]) => {
        return (
            <ul className={style.AnswersToQuestions}>
                {answersToQuestions.map(answer => renderAnswerToQuestion(answer))}
            </ul>
        );
    }

    const renderAnswerToQuestion = (answerToQuestion: IAnswerToQuestion) => {
        return (
            <li
                className={style.AnswerToQuestion}
                key={answerToQuestion.question.id}
            >
                <Answer
                    answerToQuestion={answerToQuestion}
                    cssProperties={{
                        margin: '20px 0px',
                        width: '80%'
                    }}
                />
            </li>
        );
    }

    const renderSurveyInfo = (surveyInfo: ISurveyInfo) => {
        return (
            <div className={style.Wrapper}>
                <div className={style.Header}>
                    <div className={style.SurveyDetails}>
                        <Typography
                            variant={"h4"}
                            component={"h4"}
                            sx={{
                                textAlign: 'center',
                                margin: '10px auto'
                            }}
                        >
                            {surveyInfo.title}
                        </Typography>
                        <hr />
                        <p className={style.Description}>
                            {surveyInfo.description}
                        </p>
                    </div>
                    <img
                        className={style.SurveyImage}
                        src={surveyInfo.imageUrl}
                        alt={"SurveyImage"}
                    />
                </div>
            </div>
        );
    }

    const renderSurveyAnswers = (
        surveyInfo: ISurveyInfo, 
        answersToQuestions: IAnswerToQuestion[]
    ) => {
        return (
            <div className = {style.SurveyAnswers}>
                { renderSurveyInfo(surveyInfo) }
                { renderAnswersToQuestions(answersToQuestions) }
            </div>
        );
    }

    return loading ? <CircularProgress sx = {{ margin: '100px auto' }} /> 
                   : renderSurveyAnswers(surveyInfo, answersToQuestions);
}

export default SurveyAnswers;