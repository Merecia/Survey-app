import { FC, useEffect, useState } from 'react';
import { useActions } from '../../hooks/useActions';
import { useParams } from 'react-router-dom';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { 
    IAnswerToQuestion, 
    ISurveyInfo, 
    ISurveyResults, 
    IUser, 
    ICompletionStatistics
} from '../../types/survey';
import Answer from '../../components/Answer/Answer';
import style from './SurveyResults.module.scss';
import { Typography, Button } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { getPrettyPassingTime } from '../../helper';

const SurveyResults: FC = () => {
    const { surveyResults, error, loading, user } = useTypedSelector(state => state.survey);
    const { loadSurveyResults, clearAnswersToQuestions } = useActions();
    const navigate = useNavigate();
    const id = useParams().id;

    useEffect(() => {
        if (id) {
            loadSurveyResults(id);
        }
        else {
            navigate('/');
        }
        // eslint-disable-next-line
    }, [])

    const renderAnswersToQuestions = (
        isEvaluated: boolean,
        answersToQuestions: IAnswerToQuestion[]
    ) => {
        return (
            <ul className={style.AnswersToQuestions}>
                {answersToQuestions.map(answer => renderAnswerToQuestion(isEvaluated, answer))}
            </ul>
        );
    }

    const renderAnswerToQuestion = (
        isEvaluated: boolean,
        answerToQuestion: IAnswerToQuestion
    ) => {
        return (
            <li
                className={style.AnswerToQuestion}
                key={answerToQuestion.question.id}
            >
                <Answer
                    isEvaluated={isEvaluated}
                    answerToQuestion={answerToQuestion}
                />
            </li>
        );
    }

    const goToMainPage = () => {
        clearAnswersToQuestions();
        navigate('/');

        //clearAnswersToQuestions();
        //navigate(`/survey-results/${surveyResults?.surveyId}`);
    }

    const renderCompletionStatistics = (completionStatistics: ICompletionStatistics) => {
        return (
            <div className={style.CompletionStatistics}>
                {
                    completionStatistics?.user &&
                    <div className={style.Username}>
                        <p> 
                            User: <strong> {completionStatistics?.user.displayName} </strong>
                        </p>
                    </div>
                }
                <div className={style.Statistics}>
                    <div className={style.DateTime}>
                        <p> Completion date: <strong> {completionStatistics.completionDate} </strong> </p>
                        { 
                            completionStatistics?.passingTime !== undefined && 
                            <p> How much time is spent: <strong> {completionStatistics?.passingTime} </strong> </p> 
                        }
                        { 
                            completionStatistics?.maximumPassingTime !== undefined && 
                            <p> Maximum passing time: <strong> {completionStatistics?.maximumPassingTime} </strong> </p>
                        }
                    </div>
                    {
                        completionStatistics.earnedScore !== undefined && 
                        completionStatistics.maximumScore !== undefined && 
                        completionStatistics.correctAnswersRate !== undefined &&
                        <div className={style.Score}>
                            <p> Earned score: <strong> {completionStatistics.earnedScore} </strong> </p>
                            <p> Maximum score: <strong> {completionStatistics.maximumScore} </strong> </p>
                            <p> Percent: <strong> {completionStatistics.correctAnswersRate}% </strong> </p>
                        </div>
                    }
                </div>
            </div>
        );
    }

    const renderSurveyInfo = (surveyInfo: ISurveyInfo) => {
        return (
            <>
                <div className={style.TitleDescription}>
                    <Typography
                        variant={"h4"}
                        component={"h4"}
                        className = {style.Title}
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
                        currentTarget.src =
                            process.env.REACT_APP_DEFAULT_SURVEY_IMAGE_URL
                            || 'https://fpprt.ru/wp-content/uploads/2021/02/file.jpg';
                    }}
                    style={{ width: '80%' }}
                    className={style.SurveyImage}
                    alt={"SurveyImage"}
                />
            </>
        );
    }

    const renderSurveyResults = (surveyResults: ISurveyResults) => {
        const maximumPassingTimeSeconds = surveyResults?.surveyInfo.maximumPassingTimeSeconds;
        const maximumPassingTime = maximumPassingTimeSeconds 
            ? getPrettyPassingTime(maximumPassingTimeSeconds)
            : undefined;

        return (
            <div className={style.SurveyAnswers}>
                <div className={style.Wrapper}>
                    <div className={style.Header}>
                        {
                            renderSurveyInfo(surveyResults.surveyInfo)
                        }
                        {
                            renderCompletionStatistics({
                                id: surveyResults.id,
                                completionDate: surveyResults.completionDate,
                                passingTime: surveyResults.passingTime,
                                earnedScore: surveyResults?.earnedScore,
                                maximumScore: surveyResults?.surveyInfo.maximumScore,
                                correctAnswersRate: surveyResults?.correctAnswersRate,
                                user: surveyResults?.user,
                                maximumPassingTime
                            })
                        }
                    </div>
                    {
                        renderAnswersToQuestions(
                            surveyResults.surveyInfo.isEvaluated,
                            surveyResults.answersToQuestions
                        )
                    }
                    <Button
                        variant='contained'
                        onClick={goToMainPage}
                        sx={{
                            padding: '15px',
                            width: '80%',
                            display: 'flex',
                            justifyContent: 'center',
                            margin: '10px auto'
                        }}
                    >
                        To main page
                    </Button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <>
                <Header />
                <div className={style.Loading}>
                    <CircularProgress />
                </div>
            </>
           
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className={style.Error}>
                    <Typography
                        variant={"h1"}
                        component={"h1"}
                    >
                        {error}
                    </Typography>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className={style.SurveyAnswers}>
                {surveyResults && renderSurveyResults(surveyResults)}
            </div>
        </>
    );
}

export default SurveyResults;