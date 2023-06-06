import { FC, useEffect, useState } from 'react';
import { useActions } from '../../hooks/useActions';
import { useParams } from 'react-router-dom';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { IAnswerToQuestion, ISurveyInfo, ISurveyResults } from '../../types/survey';
import Answer from '../Answer/Answer';
import style from './SurveyAnswers.module.scss';
import { Typography, Button } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SurveyAnswers: FC = () => {
    const { answersToQuestions, surveyInfo } = useTypedSelector(state => state.survey);
    const { updateAnswersToQuestions, updateSurveyInfo, clearAnswersToQuestions } = useActions();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const id = useParams().id;

    console.log(answersToQuestions);

    const loadSurveyAnswers = (id: number) => {
        const allSurveyResults = localStorage.getItem('allSurveyResults');
        const surveyResults = allSurveyResults
            ? JSON.parse(allSurveyResults).find((surveyResults: ISurveyResults) => surveyResults.id === id)
            : null;

        updateAnswersToQuestions(surveyResults.answersToQuestions);
        updateSurveyInfo(surveyResults.surveyInfo);
    }

    useEffect(() => {
        if (id) {
            loadSurveyAnswers(parseInt(id));
            setLoading(false);
        }
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
                    isEvaluated={surveyInfo.isEvaluated}
                    answerToQuestion={answerToQuestion}
                    cssProperties={{
                        margin: '20px 0px',
                        width: '80%'
                    }}
                />
            </li>
        );
    }

    const finishViewAnswers = () => {
        clearAnswersToQuestions();
        navigate('/');
    }

    const renderSurveyInfo = (surveyInfo: ISurveyInfo) => {
        return (
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
                    src={surveyInfo.imageUrl}
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = process.env.REACT_APP_DEFAULT_SURVEY_IMAGE_URL 
                        || 'https://fpprt.ru/wp-content/uploads/2021/02/file.jpg';
                    }}
                    style={{ width: '80%' }}
                    className={style.SurveyImage}
                    alt = {"SurveyImage"}
                />
            </div>
        );
    }

    const renderSurveyAnswers = (
        surveyInfo: ISurveyInfo,
        answersToQuestions: IAnswerToQuestion[]
    ) => {
        return (
            <div className={style.SurveyAnswers}>
                <div className={style.Wrapper}>
                    {renderSurveyInfo(surveyInfo)}
                    {renderAnswersToQuestions(answersToQuestions)}
                    <Button
                        variant='contained'
                        onClick={finishViewAnswers}
                        sx={{
                            padding: '15px',
                            width: '80%',
                            display: 'flex',
                            justifyContent: 'center',
                            margin: '20px auto'
                        }}
                    >
                        Back to main page
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={style.SurveyAnswers}>
            {
                loading ? <CircularProgress sx={{ margin: '100px auto' }} />
                        : renderSurveyAnswers(surveyInfo, answersToQuestions)
            }
        </div>
    );
}

export default SurveyAnswers;