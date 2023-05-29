import { FC, useState, useEffect } from 'react';
import style from './SurveyConstruct.module.scss';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import QuestionConstruct from '../QuestionConstruct/QuestionConstruct';
import { IQuestion, QuestionType } from '../../types/survey';
// import Button from '../../UI/Button/Button';
import SurveyConstructForm from './SurveyConstructForm/SurveyConstructForm';
import { Button } from '@mui/material';

const SurveyConstruct: FC = () => {
    const { updateQuestions, addNewQuestion } = useActions();
    const { questions, surveyInfo } = useTypedSelector(state => state.survey);

    const [showForm, setShowForm] = useState<boolean>(true);

    console.log(surveyInfo);

    useEffect(() => {
        const initialQuestion = {
            id: 1,
            topic: "",
            type: QuestionType.OneChoice,
            required: false,
            options: [{ id: 1, label: "", score: 0 }]
        }

        const initialQuestions = [initialQuestion];

        updateQuestions(initialQuestions);
    }, [])

    console.log(questions);

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
        alert('You have finished creating the quiz');
        console.log(questions);
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
                    {/* <Button
                        label="Add a new question"
                        clickHandler={addNewQuestion}
                        cssProperties={{
                            marginRight: '100px',
                            padding: '10px',
                            width: '220px'
                        }}
                    /> */}
                    <Button 
                        variant = 'contained' 
                        onClick = {addNewQuestion} 
                        // color = 'primary'
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
                    {/* <Button
                        label='Create the survey'
                        clickHandler={finishCreatingButtonClickHandler}
                        cssProperties={{
                            width: '220px',
                            padding: '10px'
                        }}
                    /> */}
                </div>
            </div>
        )
    }

    return (
        <div className={style.SurveyConstruct}>
            {showForm ? renderForm() : renderQuestionsConstruct()}
        </div>
    );
}

export default SurveyConstruct;

