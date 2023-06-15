import { FC, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import style from './SurveyConstructor.module.scss';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import QuestionConstruct from '../QuestionConstruct/QuestionConstruct';
import { IQuestion, ISurvey, SurveyConstructorType } from '../../types/survey';
import SurveyConstructorForm from './SurveyConstructorForm/SurveyConstructorForm';
import { Snackbar, Alert, CircularProgress } from '@mui/material';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
    areAllQuestionsFilledOut, 
    calculateMaximumScore, 
    createSurvey, 
    updateSurvey 
} from '../../helper';

const SurveyConstructor: FC = () => {
    const { questions, surveyInfo } = useTypedSelector(state => state.survey);
    const { addNewQuestion, loadSurvey } = useActions();
    const [showSurveyConstructorForm, setShowSurveyConstructorForm] = useState<boolean>(true);
    const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
    const [errorAlert, setErrorAlert] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const id = useParams().id;
    const constructorType = id ? SurveyConstructorType.Editing : SurveyConstructorType.Adding;

    console.log(questions);
    console.log(surveyInfo);

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

    useEffect(() => {
        if (id) {
            loadSurvey(parseInt(id));
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [])

    const finishCreatingButtonClickHandler = () => {
        if (questions.length === 0) {
            setShowErrorAlert(true);
            setErrorAlert('At least one question should be added');
            return;
        }

        if ( !areAllQuestionsFilledOut(questions, surveyInfo.isEvaluated) ) {
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
            createSurvey({ surveyInfo, questions });
        } else if (constructorType === SurveyConstructorType.Editing) {
            updateSurvey({ surveyInfo, questions });
        }

        setShowSuccessAlert(true);

        const delay = 1500;
        setTimeout(() => {
            navigate('/');
        }, delay);
    }

    const renderSurveyConstructorForm = (survey?: ISurvey) => {
        if (survey) {
            return (
                <div className={style.SurveyConstructForm}>
                    <SurveyConstructorForm 
                        setShowForm={setShowSurveyConstructorForm} 
                        survey={ survey }
                    />
                </div>
            );
        } else {
            return (
                <div className={style.SurveyConstructForm}>
                    <SurveyConstructorForm 
                        setShowForm={setShowSurveyConstructorForm} 
                    />
                </div>
            )
        }
    }

    const renderQuestionsConstructor = (questions: IQuestion[]) => {
        return (
            <div className={style.QuestionsConstruct}>

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
                    { renderQuestions(questions) }
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
                        onClick={finishCreatingButtonClickHandler}
                        color='secondary'
                        sx={{
                            width: '220px',
                            padding: '10px'
                        }}
                    >
                        {
                            constructorType === SurveyConstructorType.Adding 
                                ? 'Create the survey' : 'Edit the survey'
                        }
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={style.SurveyConstruct}>
            {
                loading 
                ? <CircularProgress sx={{ margin: '200px auto' }}  />
                : showSurveyConstructorForm 
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

