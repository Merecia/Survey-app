import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { IQuestion, ISurveyResults, ISurveyInfo } from '../../types/survey';
import Question from '../Question/Question';
import style from './Survey.module.scss';
import { Button, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';
import useInterval from '../../hooks/useInterval';
import SurveyFinishModal from './SurveyFinishModal/SurveyFinishModal';
import { areAllRequiredQuestionsAnswered, calculateEarnedScore } from '../../helper';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';

const Survey: FC = () => {
    const { loadSurvey } = useActions();
    const { answersToQuestions, questions, surveyInfo, loading, error } = useTypedSelector(state => state.survey);
    const [timeStart, setTimeStart] = useState(new Date());
    const [passingTimeSeconds, setPassingTimeSeconds] = useState<number>(0);
    const [surveyResults, setSurveyResults] = useState<ISurveyResults | null>(null);
    const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
    const [showWarningAlert, setShowWarningAlert] = useState<boolean>(false);
    const [errorAlert, setErrorAlert] = useState<string>('');

    const id = useParams().id;
    const navigate = useNavigate();

    console.log(questions);

    useEffect(() => {
        if (id) {
            loadSurvey(id);
            setTimeStart(new Date());
        } else {
            navigate('/')
        }
        // eslint-disable-next-line
    }, [])

    useInterval(() => {
        const maximumPassingTimeSeconds = surveyInfo.maximumPassingTimeSeconds;

        if (maximumPassingTimeSeconds) {
            const now = new Date();
            const dt = (now.getTime() - timeStart.getTime()) / 1000;

            if (Math.floor(dt) === Number(maximumPassingTimeSeconds)) {
                setShowWarningAlert(true);
                finishSurvey(maximumPassingTimeSeconds);
            } else {
                setPassingTimeSeconds(Math.floor(dt));
            }
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

    const finishSurvey = async (passingTimeSeconds: number) => {
        const surveyResults = {
            surveyId: id,
            surveyInfo,
            passingTimeSeconds,
            answersToQuestions
        } as ISurveyResults;

        if (surveyInfo.isEvaluated) {
            surveyResults.earnedScore = calculateEarnedScore(answersToQuestions);
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
        <div className={style.Survey}>
            { renderSurvey(surveyInfo, questions) }
        </div>
    );
}

export default Survey;