import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { IQuestion, ISurveyResults, ISurveyInfo } from '../../types/survey';
import Question from '../../components/Question/Question';
import style from './Survey.module.scss';
import { Button, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';
import useInterval from '../../hooks/useInterval';
import SurveyFinishModal from '../../components/SurveyFinishModal/SurveyFinishModal';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import Header from '../../components/Header/Header';
import {
    areAllRequiredQuestionsAnswered,
    calculateEarnedScore,
    getCorrectAnswersRate,
    getPrettyDateTime,
    getPrettyPassingTime
} from '../../helper';

const Survey: FC = () => {
    const [timeStart, setTimeStart] = useState(new Date());
    const [passingTimeSeconds, setPassingTimeSeconds] = useState<number>(0);
    const [surveyResults, setSurveyResults] = useState<ISurveyResults | null>(null);
    const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
    const [showWarningAlert, setShowWarningAlert] = useState<boolean>(false);
    const [errorAlert, setErrorAlert] = useState<string>('');
    const { loadSurvey, clearAnswersToQuestions } = useActions();
    const {
        answersToQuestions,
        questions,
        surveyInfo,
        loading,
        error,
        user
    } = useTypedSelector(state => state.survey);

    const id = useParams().id;
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            loadSurvey(id);
            clearAnswersToQuestions();
            setTimeStart(new Date());
        } else {
            navigate('/')
        }
        // eslint-disable-next-line
    }, [])

    useInterval(() => {
        const maximumPassingTimeSeconds = surveyInfo.maximumPassingTimeSeconds;
        const now = new Date();
        const dt = (now.getTime() - timeStart.getTime()) / 1000;

        if (
            maximumPassingTimeSeconds &&
            Math.floor(dt) === Number(maximumPassingTimeSeconds)
        ) {
            setShowWarningAlert(true);
            finishSurvey(maximumPassingTimeSeconds);
        } else {
            setPassingTimeSeconds(Math.floor(dt));
        }
    }, 1000)

    const renderErrorAlert = (message: string) => (
        <Snackbar
            open={showErrorAlert}
            autoHideDuration={6000}
            onClose={() => setShowErrorAlert(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert onClose={() => setShowErrorAlert(false)} severity="error">
                {message}
            </Alert>
        </Snackbar>
    )

    const renderSuccessAlert = (message: string) => (
        <Snackbar
            open={showSuccessAlert}
            autoHideDuration={6000}
            onClose={() => setShowSuccessAlert(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert onClose={() => setShowSuccessAlert(false)} severity="success">
                {message}
            </Alert>
        </Snackbar>
    )

    const renderWarningAlert = (message: string) => (
        <Snackbar
            open={showWarningAlert}
            autoHideDuration={6000}
            onClose={() => setShowWarningAlert(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert onClose={() => setShowWarningAlert(false)} severity="warning">
                {message}
            </Alert>
        </Snackbar>
    )

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
                <Question question={question} />
            </li>
        );
    }

    const finishSurvey = async (passingTimeSeconds: number) => {
        const surveyResults = {
            surveyId: id,
            surveyInfo,
            passingTime: getPrettyPassingTime(passingTimeSeconds),
            completionDate: getPrettyDateTime(new Date()),
            answersToQuestions
        } as ISurveyResults;

        if (user) {
            surveyResults.user = user;
        }

        if (surveyInfo.isEvaluated) {
            const earnedScore = calculateEarnedScore(answersToQuestions);
            const maximumScore = surveyInfo.maximumScore || 0;

            surveyResults.earnedScore = earnedScore;
            surveyResults.correctAnswersRate = getCorrectAnswersRate(earnedScore, maximumScore);
        }

        addDoc(collection(db, 'surveyResults'), surveyResults)
            .then((docRef) => {
                surveyResults.id = docRef.id;
                setSurveyResults(surveyResults);

            })
            .catch((error) => {
                setShowErrorAlert(true);
                setErrorAlert(error as string);
            });
    }

    const finishButtonClickHandler = async () => {
        if (areAllRequiredQuestionsAnswered(questions, answersToQuestions)) {
            setShowSuccessAlert(true);
            finishSurvey(passingTimeSeconds);
        } else {
            setShowErrorAlert(true);
            setErrorAlert('You need to answer all required questions.');
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

                {showErrorAlert && renderErrorAlert(errorAlert)}
                {showSuccessAlert && renderSuccessAlert('Your answers have been successfully saved.')}
                {showWarningAlert && renderWarningAlert('The time to pass the survey came out.')}

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
        const { 
            title,
            maximumPassingTimeSeconds,
            description,
            imageUrl 
        } = surveyInfo;

        return (
            <div className={style.Header}>
                <div className={style.SurveyDetails}>
                    <div 
                        className = {style.SurveyDetails_Header}
                        style = {{
                            display: 'flex',
                            justifyContent: 
                                maximumPassingTimeSeconds 
                                ? 'space-around' 
                                : 'center'
                        }}
                    >
                        <Typography
                            variant={"h4"}
                            component={"h4"}
                        >
                            {title}
                        </Typography>
                        {
                            maximumPassingTimeSeconds &&
                            <Typography
                                variant={"h4"}
                                component={"h4"}
                            >
                                {
                                    getPrettyPassingTime(
                                        maximumPassingTimeSeconds - 
                                        passingTimeSeconds
                                    )
                                }
                            </Typography>
                        }
                    </div>
                    <hr />
                    <p className={style.SurveyDetails_Description}>
                        {description}
                    </p>
                </div>
                <img
                    src={imageUrl}
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = process.env.REACT_APP_DEFAULT_SURVEY_IMAGE_URL || 
                        'https://fpprt.ru/wp-content/uploads/2021/02/file.jpg';
                    }}
                    className={style.SurveyImage}
                    alt={"SurveyImage"}
                />
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
            <div className={style.Survey}>
                {renderSurvey(surveyInfo, questions)}
            </div>
        </>
    );
}

export default Survey;