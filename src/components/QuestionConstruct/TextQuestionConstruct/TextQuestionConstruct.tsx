import React, { FC } from 'react';
import { IQuestion } from '../../../types/survey';
import style from './TextQuestionConstruct.module.scss';
import Input from '../../../UI/Input/Input';
import { isTextAnswer } from '../../../helper';
import Checkbox from '../../../UI/Checkbox/Checkbox';
import { useActions } from '../../../hooks/useActions';

interface ITextQuestionConstructProps {
    question: IQuestion;
    cssProperties?: React.CSSProperties;
}

const TextQuestionConstruct: FC<ITextQuestionConstructProps> = ({
    question,
    cssProperties
}) => {
    const { updateQuestion } = useActions();

    const correctAnswerChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isTextAnswer(question.correctAnswer)) {
            question.correctAnswer.text = event.target.value;
            updateQuestion(question);
        }
    }
    const scoreChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isTextAnswer(question.correctAnswer)) {
            question.correctAnswer.score = Number(event.target.value);
            updateQuestion(question);
        }
    }
    const ignoreRegisterChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isTextAnswer(question.correctAnswer)) {
            question.correctAnswer.ignoreRegister = event.target.checked;
            updateQuestion(question);
        }
    }

    return (
        <div className={style.TextQuestionConstruct} style={cssProperties}>
            <p> Enter a correct answer: </p>
            <Input
                value={
                    isTextAnswer(question.correctAnswer)
                        ? question.correctAnswer.text : ''
                }
                onChangeHandler={correctAnswerChangeHandler}
                cssProperties={{ width: '100%', marginBottom: '10px' }}
            />
            <p> Enter score for a correct answer: </p>
            <Input
                value={
                    isTextAnswer(question.correctAnswer) && question.correctAnswer.score
                        ? question.correctAnswer.score : 0
                }
                type={"number"}
                onChangeHandler={scoreChangeHandler}
                cssProperties={{ width: '100%' }}
            />
            <Checkbox
                label={"Ignore register"}
                checked={
                    isTextAnswer(question.correctAnswer)
                        ? question.correctAnswer.ignoreRegister : false
                }
                onChangeHandler={ignoreRegisterChangeHandler}
                cssProperties={{
                    display: 'flex',
                    justifyContent: 'right',
                    marginTop: '20px'
                }}
            />
        </div>
    );
}

export default TextQuestionConstruct;