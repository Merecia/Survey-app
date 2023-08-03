import { FC, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { IQuestion, ISurvey, SurveyConstructorType } from '../../types/survey';
import { Snackbar, Alert, CircularProgress, Typography } from '@mui/material';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { areAllQuestionsFilledOut, calculateMaximumScore } from '../../helper';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import style from './SurveyConstructor.module.scss';
import SurveyConstructorForm from '../../components/SurveyConstructorForm/SurveyConstructorForm';
import QuestionConstruct from '../../components/QuestionConstruct/QuestionConstruct';
import Header from '../../components/Header/Header';

const SurveyConstructor: FC = () => {
    const { questions, surveyInfo, user, loading, error } = useTypedSelector(state => state.survey);
    const { addNewQuestion, loadSurvey } = useActions();
    const [showSurveyConstructorForm, setShowSurveyConstructorForm] = useState<boolean>(true);
    const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
    const [errorAlert, setErrorAlert] = useState<string>('');
    const navigate = useNavigate();

    const id = useParams().id;
    const constructorType = id ? SurveyConstructorType.Editing : SurveyConstructorType.Adding;

    console.log(questions);
    console.log(surveyInfo);

    useEffect(() => {
        if (id) {
            loadSurvey(id);
        }
    }, [])

    const renderQuestions = (questions: IQuestion[]) => {
        return questions.map(question => renderQuestion(question));
    }

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

    const renderQuestion = (question: IQuestion) => {
        return (
            <QuestionConstruct
                key={question.id}
                question={question}
                cssProperties={{ marginBottom: '20px' }}
            />
        );
    }

    const finishCreatingButtonClickHandler = async () => {
        if (questions.length === 0) {
            setShowErrorAlert(true);
            setErrorAlert('At least one question should be added');
            return;
        }

        if (!areAllQuestionsFilledOut(questions, surveyInfo.isEvaluated)) {
            setShowErrorAlert(true);
            setErrorAlert('You need to fill out all questions');
            return;
        }

        if (surveyInfo.isEvaluated) {
            const maximumScore = calculateMaximumScore(questions);

            if (maximumScore === 0) {
                setShowErrorAlert(true);
                setErrorAlert(`The maximum score for the test can't be equal to 0`);
                return;
            }

            surveyInfo.maximumScore = maximumScore;
        }

        if (constructorType === SurveyConstructorType.Adding) {
            try {
                const survey = { surveyInfo, questions, userId: user?.uid };
                await addDoc(collection(db, 'surveys'), survey);
                setShowSuccessAlert(true);
                const delay = 1000;
                setTimeout(() => {
                    navigate('/');
                }, delay);
            } catch (error) {
                setShowErrorAlert(true);
                setErrorAlert(error as string);
            }
        } else if (constructorType === SurveyConstructorType.Editing && id) {
            try {
                const survey = { surveyInfo, questions, userId: user?.uid };
                await setDoc(doc(db, 'surveys', id), survey);
                setShowSuccessAlert(true);
                const delay = 1000;
                setTimeout(() => {
                    navigate('/');
                }, delay);
            } catch (error) {
                setShowErrorAlert(true);
                setErrorAlert(error as string);
            }
        }
    }

    const renderSurveyConstructorForm = (survey?: ISurvey) => {
        if (survey) {
            return (
                <SurveyConstructorForm
                    setShowForm={setShowSurveyConstructorForm}
                    survey={survey}
                />
            );
        } else {
            return (
                <SurveyConstructorForm
                    setShowForm={setShowSurveyConstructorForm}
                />
            );
        }
    }

    const renderQuestionsConstructor = (questions: IQuestion[]) => {
        return (
            <div className={style.QuestionsConstructor}>

                {showErrorAlert && renderErrorAlert(errorAlert)}

                {
                    showSuccessAlert && renderSuccessAlert(
                        constructorType === SurveyConstructorType.Adding
                            ? `The survey was successfully created.`
                            : `The survey was successfully updated.`
                    )
                }

                <div className={style.Header}>
                    <div className={style.SurveyDetails}>
                        <h2 className={style.Title}> {surveyInfo.title} </h2>
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
                        alt={"SurveyImage"}
                        className={style.SurveyImage}
                    />
                </div>
                <div className={style.Questions}>
                    {renderQuestions(questions)}
                </div>
                <div className={style.Footer}>
                    <Button
                        variant='contained'
                        onClick={addNewQuestion}
                        color='info'
                        sx={{
                            marginRight: '100px',
                            padding: '10px',
                            width: '220px'
                        }}
                    >
                        Add a new question
                    </Button>

                    <Button
                        variant='contained'
                        onClick={
                            async () => {
                                await finishCreatingButtonClickHandler()
                            }
                        }
                        color='secondary'
                        sx={{ width: '220px', padding: '10px' }}
                    >
                        {
                            constructorType === SurveyConstructorType.Adding
                                ? 'Create the survey'
                                : 'Edit the survey'
                        }
                    </Button>
                </div>
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
        <div className={style.SurveyConstructor}>
            <Header />
            {
                showSurveyConstructorForm
                    ? renderSurveyConstructorForm(
                        constructorType === SurveyConstructorType.Editing
                            ? { surveyInfo, questions } as ISurvey : undefined
                    )
                    : renderQuestionsConstructor(questions)
            }
        </div>
    );
}

export default SurveyConstructor;

