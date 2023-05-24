import React, { FC, useState, useEffect } from 'react';
import style from './SurveyConstruct.module.scss';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import QuestionConstruct from '../QuestionConstruct/QuestionConstruct';
import { IQuestion, QuestionType } from '../../types/survey';
import Button from '../../UI/Button/Button';

const SurveyConstruct: FC = () => {
    const { updateQuestions } = useActions();
    const { questions } = useTypedSelector(state => state.survey);

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
                cssProperties={{marginBottom: '20px'}}
            />
        );
    }

    const addNewQuestionButtonClickHandler = () => {
        const lastId = questions.length;
        const newQuestion = {
            id: lastId + 1,
            topic: "",
            type: QuestionType.OneChoice,
            required: false,
            options: [{ id: 1, label: "", score: 0 }]
        };

        const updatedQuestions = [...questions];
        updatedQuestions.push(newQuestion);
        updateQuestions(updatedQuestions);
    }

    const finishCreatingButtonClickHandler = () => {
        alert('You have finished creating the quiz');
        console.log(questions);
    }

    return (
        <div className={style.SurveyConstruct}>
            <h1 className={style.Title}> Survey Construct </h1>
            <div className={style.Questions}>
                {renderQuestions()}
            </div>
            <div className={style.Footer}>
                <Button
                    label="Add a new question"
                    clickHandler={addNewQuestionButtonClickHandler}
                    cssProperties={{
                        marginRight: '100px',
                        padding: '10px',
                        width: '220px'
                    }}
                />
                <Button
                    label='Create the survey'
                    clickHandler={finishCreatingButtonClickHandler}
                    cssProperties={{
                        width: '220px',
                        padding: '10px'
                    }}
                />
            </div>
        </div>
    );
}

export default SurveyConstruct;

