import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { IQuestion, ISurvey, ISurveyResults, ISurveyInfo, IAnswerToQuestion } from '../../types/survey';
import Question from '../Question/Question';
import style from './Survey.module.scss';
import { Button, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';
import useInterval from '../../hooks/useInterval';
import SurveyFinishModal from './SurveyFinishModal/SurveyFinishModal';
import { isMatches, isOption, isSetOfOptions, isTextAnswer } from '../../helper';

const Survey: FC = () => {
    const { updateQuestions, updateSurveyInfo } = useActions();
    const { answersToQuestions, questions, surveyInfo } = useTypedSelector(state => state.survey);
    const [timeStart, setTimeStart] = useState(new Date());
    const [passingTimeSeconds, setPassingTimeSeconds] = useState<number>(0);
    const [surveyResults, setSurveyResults] = useState<ISurveyResults | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorAlert, setErrorAlert] = useState<boolean>(false);
    const [successAlert, setSuccessAlert] = useState<boolean>(false);
    const [warningAlert, setWarningAlert] = useState<boolean>(false);
    const id = useParams().id;

    const loadSurvey = (id: number) => {
        const surveys = localStorage.getItem('surveys');
        const survey = surveys
            ? JSON.parse(surveys).find((survey: ISurvey) => survey.surveyInfo.id === id)
            : null;

        updateQuestions(survey.questions);
        updateSurveyInfo(survey.surveyInfo);
    }

    console.log(questions);

    useEffect(() => {
        if (id) {
            loadSurvey(parseInt(id));
            setTimeStart(new Date());
            setLoading(false);
        }
        // eslint-disable-next-line
    }, [])

    const renderErrorAlert = (message: string) => (
        <Snackbar
            open={errorAlert}
            autoHideDuration={6000}
            onClose={() => setErrorAlert(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert onClose={() => setErrorAlert(false)} severity="error">
                {message}
            </Alert>
        </Snackbar>
    )

    const renderSuccessAlert = (message: string) => (
        <Snackbar
            open={successAlert}
            autoHideDuration={6000}
            onClose={() => setSuccessAlert(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert onClose={() => setSuccessAlert(false)} severity="success">
                {message}
            </Alert>
        </Snackbar>
    )

    const renderWarningAlert = (message: string) => (
        <Snackbar
            open={warningAlert}
            autoHideDuration={6000}
            onClose={() => setWarningAlert(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert onClose={() => setWarningAlert(false)} severity="warning">
                {message}
            </Alert>
        </Snackbar>
    )

    useInterval(() => {
        const maximumPassingTimeSeconds = surveyInfo.maximumPassingTimeSeconds;

        if (maximumPassingTimeSeconds) {
            const now = new Date();
            const dt = (now.getTime() - timeStart.getTime()) / 1000;

            if (Math.floor(dt) === Number(maximumPassingTimeSeconds)) {
                setWarningAlert(true);
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

    const calculateEarnedScore = (answersToQuestions: IAnswerToQuestion[]): number => {
        let earnedScore: number = 0;

        answersToQuestions.forEach(answerToQuestion => {
            const answer = answerToQuestion.answer;

            if (isOption(answer) || isTextAnswer(answer)) {
                earnedScore += answer.score as number;
            } else if (isMatches(answer)) {
                answer.leftList.forEach(option => {
                    earnedScore += option.score as number;
                })
            } else if (isSetOfOptions(answer)) {
                answer.forEach(option => {
                    earnedScore += option.score as number;
                })
            }
        })

        return earnedScore;
    }

    const finishSurvey = (passingTimeSeconds: number) => {
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

        const surveyResults: ISurveyResults = {
            id,
            surveyInfo,
            passingTimeSeconds,
            answersToQuestions
        };

        if (surveyInfo.isEvaluated) {
            surveyResults.earnedScore = calculateEarnedScore(answersToQuestions);
        }

        allSurveyResults.push(surveyResults);
        localStorage.setItem('allSurveyResults', JSON.stringify(allSurveyResults));
        setSurveyResults(surveyResults);
    }

    const finishButtonClickHandler = () => {
        if (areAllRequiredQuestionsAnswered()) {
            setSuccessAlert(true);
            finishSurvey(passingTimeSeconds);
        } else {
            setErrorAlert(true);
        }
    }

    const renderSurvey = (surveyInfo: ISurveyInfo, questions: IQuestion[]) => {
        return (
            <div className={style.Wrapper}>
                {
                    surveyResults &&
                    <SurveyFinishModal
                        surveyResultsId={surveyResults.id}
                        earnedScore={surveyResults.earnedScore}
                        maximumScore={surveyInfo.maximumScore}
                    />
                }

                {errorAlert && renderErrorAlert('You need to answer all required questions.')}
                {successAlert && renderSuccessAlert('Your answers have been successfully saved.')}
                {warningAlert && renderWarningAlert('The time to pass the survey came out.')}

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
                    src={surveyInfo.imageUrl}
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = process.env.REACT_APP_DEFAULT_SURVEY_IMAGE_URL
                            || 'https://fpprt.ru/wp-content/uploads/2021/02/file.jpg';
                    }}
                    style={{ width: '80%' }}
                    className={style.SurveyImage}
                    alt={"SurveyImage"}
                />
            </div>
        );
    }

    return (
        <div className={style.Survey}>
            {
                loading ? <CircularProgress sx={{ margin: '200px auto' }} />
                    : renderSurvey(surveyInfo, questions)
            }
        </div>
    );
}

export default Survey;