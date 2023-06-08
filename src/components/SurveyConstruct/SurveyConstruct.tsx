import { FC, useState } from 'react';
import style from './SurveyConstruct.module.scss';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import QuestionConstruct from '../QuestionConstruct/QuestionConstruct';
import { IQuestion, ISurvey, QuestionType } from '../../types/survey';
import SurveyConstructForm from './SurveyConstructForm/SurveyConstructForm';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { isMatches, isSetOfOptions, isTextAnswer } from '../../helper';

const SurveyConstruct: FC = () => {
    const { questions, surveyInfo } = useTypedSelector(state => state.survey);
    const { addNewQuestion } = useActions();
    const [showSurveyConstructForm, setShowSurveyConstructForm] = useState<boolean>(true);
    const navigate = useNavigate();

    const renderQuestions = () => {
        return questions.map(question => renderQuestion(question));
    }

    const renderQuestion = (question: IQuestion) => {
        return (
            <QuestionConstruct
                key={question.id}
                question={question}
                cssProperties={{ marginBottom: '20px' }}
            />
        );
    }

    const calculateMaximumScore = (questions: IQuestion[]) => {
        let maximumScore: number = 0;

        questions.forEach(question => {
            if (
                question.type === QuestionType.OneChoice ||
                question.type === QuestionType.MultipleChoice
            ) {
                if (isSetOfOptions(question.options)) {
                    question.options.forEach(option => {
                        if (option.score && option.score > 0) { 
                            maximumScore += option.score as number;
                        }
                    })
                }
            } else if (
                question.type === QuestionType.ShortTextField ||
                question.type === QuestionType.DetailedTextField
            ) {
                if (isTextAnswer(question.correctAnswer)) {
                    maximumScore += question.correctAnswer.score as number;
                }
            } else if (
                question.type === QuestionType.Matchmaking
            ) {
                if (isMatches(question.options)) {
                    question.options.leftList.forEach(option => {
                        if (option.score && option.score > 0) {
                            maximumScore += option.score as number;
                        }
                    })
                }
            }
        })

        return maximumScore;
    }

    const finishCreatingButtonClickHandler = () => {
        alert('You have finished creating the survey');

        if (surveyInfo.isEvaluated) {
            surveyInfo.maximumScore = calculateMaximumScore(questions);
        }

        const survey: ISurvey = { surveyInfo, questions };
        const surveysData = localStorage.getItem('surveys');

        let surveys;
        if (surveysData) {
            surveys = JSON.parse(surveysData);
            surveys.push(survey);
        } else surveys = [survey];

        localStorage.setItem('surveys', JSON.stringify(surveys));
        // navigate(`/survey/${surveyInfo.id}`);
        navigate('/');
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

