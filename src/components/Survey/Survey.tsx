import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { IQuestion, ISurvey, ISurveyResults, ISurveyInfo } from '../../types/survey';
import Question from '../Question/Question';
import style from './Survey.module.scss';
import { Button, Typography, CircularProgress } from '@mui/material';
import useInterval from '../../hooks/useInterval';
import { useNavigate } from 'react-router-dom';

const Survey: FC = () => {
    const { updateQuestions, updateSurveyInfo } = useActions();
    const { answersToQuestions, questions, surveyInfo } = useTypedSelector(state => state.survey);
    const [timeStart, setTimeStart] = useState(new Date());
    const [passingTimeSeconds, setPassingTimeSeconds] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const id = useParams().id;

    const loadSurvey = (id: number) => {
        const surveys = localStorage.getItem('surveys');
        const survey = surveys 
            ? JSON.parse(surveys).find((survey: ISurvey) => survey.surveyInfo.id === id) 
            : null;

        updateQuestions(survey.questions);
        updateSurveyInfo(survey.surveyInfo);
    }

    useEffect(() => {
        if (id) {
            loadSurvey(parseInt(id));
            setTimeStart(new Date());
            setLoading(false);
        }
        // eslint-disable-next-line
    }, [])

    console.log(questions);
    console.log(surveyInfo);
    console.log(answersToQuestions);

    useInterval(() => {
        const maximumPassingTimeSeconds = surveyInfo.maximumPassingTimeSeconds;

        if (maximumPassingTimeSeconds) {
            const now = new Date();
            const dt = (now.getTime() - timeStart.getTime()) / 1000;

            if (Math.floor(dt) === Number(maximumPassingTimeSeconds)) {
                alert('Time is over. Finishing survey...');
                finishSurvey(maximumPassingTimeSeconds);
            } else {
                setPassingTimeSeconds(Math.floor(dt));
            }
        }
    }, 1000)

    const renderQuestions = (questions: IQuestion[]) => {
        return (
            <ul className={style.Questions}>
                {questions.map(question => renderQuestion(question))}
            </ul>
        );
    }

    const renderQuestion = (question: IQuestion) => {
        return (
            <li className={style.Question} key={question.id}>
                <Question
                    question={question}
                    cssProperties={{
                        margin: '20px 0px',
                        width: '80%'
                    }}
                />
            </li>
        );
    }

    const areAllRequiredQuestionsAnswered = (): boolean => {
        const requiredQuestionsId: number[] = [];

        questions.forEach(question => {
            if (question.required) {
                requiredQuestionsId.push(question.id);
            }
        })

        const answeredQuestionsId: number[] = answersToQuestions.map(
            answerToQuestion => answerToQuestion.question.id
        );

        let allRequiredQuestionsAreAnswered = true;

        requiredQuestionsId.forEach(requiredQuestionId => {
            if (!answeredQuestionsId.includes(requiredQuestionId)) {
                allRequiredQuestionsAreAnswered = false;
            }
        })

        return allRequiredQuestionsAreAnswered;
    }

    const finishSurvey = (passingTimeSeconds: number) => {
        alert('You have finished passing the survey');

        const allSurveyResultsData = localStorage.getItem('allSurveyResults');
        let allSurveyResults, id;

        if (allSurveyResultsData) {
            allSurveyResults = JSON.parse(allSurveyResultsData);
            const lastSurvey = allSurveyResults[allSurveyResults.length - 1];
            id = lastSurvey.id + 1;
        } else {
            allSurveyResults = [];
            id = 1;
        }

        const surveyResults: ISurveyResults = { id, surveyInfo, passingTimeSeconds, answersToQuestions };

        allSurveyResults.push(surveyResults);
        localStorage.setItem('allSurveyResults', JSON.stringify(allSurveyResults));
        navigate(`/survey-results/${id}`);
    }

    const finishButtonClickHandler = () => {
        if (areAllRequiredQuestionsAnswered()) {
            finishSurvey(passingTimeSeconds);
        } else {
            alert('You need to answer all required questions');
        }
    }

    const renderSurvey = (surveyInfo: ISurveyInfo, questions: IQuestion[]) => {
        return (
            <div className={style.Survey}>
                <div className={style.Wrapper}>
                    {renderSurveyInfo(surveyInfo)}
                    {renderQuestions(questions)}
                    <Button
                        variant='contained'
                        onClick={finishButtonClickHandler}
                        sx={{
                            padding: '15px',
                            width: '80%',
                            display: 'flex',
                            justifyContent: 'center',
                            margin: '20px auto'
                        }}
                    >
                        Finish the survey
                    </Button>
                </div>
            </div>
        );
    }

    const renderSurveyInfo = (surveyInfo: ISurveyInfo) => {
        return (
            <div className={style.Header}>
                <div className={style.SurveyDetails} style={{ width: '80%' }}>
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
                    <p className={style.Description}> {surveyInfo.description} </p>
                </div>
                <img
                    className={style.SurveyImage}
                    src={surveyInfo.imageUrl}
                    alt={"SurveyImage"}
                    style={{ width: '80%' }}
                />
            </div>
        );
    }

    return loading ? <CircularProgress sx = {{ marginTop: '200px' }} /> 
                   : renderSurvey(surveyInfo, questions);
}

export default Survey;