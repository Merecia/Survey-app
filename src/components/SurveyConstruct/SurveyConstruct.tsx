import { FC, useState } from 'react';
import style from './SurveyConstruct.module.scss';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import QuestionConstruct from '../QuestionConstruct/QuestionConstruct';
import { IQuestion, ISurvey } from '../../types/survey';
import SurveyConstructForm from './SurveyConstructForm/SurveyConstructForm';
import { Snackbar, Alert } from '@mui/material';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { areAllQuestionsFilledOut, calculateMaximumScore } from '../../helper';

const SurveyConstruct: FC = () => {
    const { questions, surveyInfo } = useTypedSelector(state => state.survey);
    const { addNewQuestion } = useActions();
    const [showSurveyConstructForm, setShowSurveyConstructForm] = useState<boolean>(true);
    const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);

    const [errorAlert, setErrorAlert] = useState<string>('');
    const navigate = useNavigate();

    const renderQuestions = () => {
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

    const saveSurvey = (survey: ISurvey) => {
        const surveysData = localStorage.getItem('surveys');

        let surveys;
        if (surveysData) {
            surveys = JSON.parse(surveysData);
            surveys.push(survey);
        } else surveys = [survey];

        localStorage.setItem('surveys', JSON.stringify(surveys));
    }

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

        saveSurvey({ surveyInfo, questions });
        setShowSuccessAlert(true);

        const delay = 1500;
        setTimeout(() => {
            navigate('/');
        }, delay);
    }

    const renderSurveyConstructForm = () => {
        return (
            <div className={style.SurveyConstructForm}>
                <SurveyConstructForm setShowForm={setShowSurveyConstructForm} />
            </div>
        );
    }

    const renderQuestionsConstruct = () => {
        return (
            <div className={style.QuestionsConstruct}>

                {showErrorAlert && renderErrorAlert(errorAlert)}
                {showSuccessAlert && renderSuccessAlert('The survey was successfully created.')}

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
                    {renderQuestions()}
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
                        Create the survey
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={style.SurveyConstruct}>
            {
                showSurveyConstructForm 
                ? renderSurveyConstructForm() 
                : renderQuestionsConstruct()
            }
        </div>
    );
}

export default SurveyConstruct;

