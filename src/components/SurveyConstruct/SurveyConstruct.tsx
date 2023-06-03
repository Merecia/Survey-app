import { FC, useState, useEffect } from 'react';
import style from './SurveyConstruct.module.scss';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import QuestionConstruct from '../QuestionConstruct/QuestionConstruct';
import { IOption, IQuestion, ISurvey, QuestionType } from '../../types/survey';
import SurveyConstructForm from './SurveyConstructForm/SurveyConstructForm';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SurveyConstruct: FC = () => {
    const { questions, surveyInfo } = useTypedSelector(state => state.survey);
    const { updateQuestions, addNewQuestion } = useActions();
    const [showForm, setShowForm] = useState<boolean>(true);
    const navigate = useNavigate();

    console.log(questions);

    useEffect(() => {
        const initialOption: IOption = { id: 1, label: '' };

        if (surveyInfo.isEvaluated) initialOption.score = 0;

        const initialQuestions = [{
            id: 1,
            topic: "",
            type: QuestionType.OneChoice,
            required: false,
            options: [initialOption]
        }];

        updateQuestions(initialQuestions);
    }, [])

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

    const finishCreatingButtonClickHandler = () => {
        alert('You have finished creating the survey');

        const survey: ISurvey = { surveyInfo, questions };
        const surveysData = localStorage.getItem('surveys');

        let surveys;
        if (surveysData) {
            surveys = JSON.parse(surveysData);
            surveys.push(survey);
        }
        else {
            surveys = [survey];
        }

        localStorage.setItem('surveys', JSON.stringify(surveys));
        navigate(`/survey/${surveyInfo.id}`);
    }

    const renderForm = () => {
        return (
            <div className = {style.SurveyConstructForm}>
                <SurveyConstructForm setShowForm={setShowForm} />
            </div>
        );
    }

    const renderQuestionsConstruct = () => {
        return (
            <div className={style.QuestionsConstruct}>
                <div className = {style.Header}>
                    <div className = {style.SurveyDetails}>
                        <h2 className={style.Title}> {surveyInfo.title} </h2>
                        <hr/>
                        <p className={style.Description}> {surveyInfo.description} </p>
                    </div>
                    <img 
                        className = {style.SurveyImage}
                        src={surveyInfo.imageUrl} 
                        alt={"SurveyImage"} 
                    />
                </div>
                <div className={style.Questions}>
                    {renderQuestions()}
                </div>
                <div className={style.Footer}>
                    <Button 
                        variant = 'contained' 
                        onClick = {addNewQuestion} 
                        color = 'info'
                        sx = {{
                            marginRight: '100px',
                            padding: '10px',
                            width: '220px'
                        }}
                    > 
                        Add a new question
                    </Button>

                    <Button 
                        variant = 'contained' 
                        onClick = {finishCreatingButtonClickHandler} 
                        color = 'secondary'
                        sx = {{
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
            { showForm ? renderForm() : renderQuestionsConstruct() }
        </div>
    );
}

export default SurveyConstruct;

