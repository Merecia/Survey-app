import React, { FC } from 'react';
import { IQuestion } from '../../../types/survey';
import style from './TextQuestionConstruct.module.scss';
import Input from '../../../UI/Input/Input';
import { isTextAnswer } from '../../../helper';
// import Checkbox from '../../../UI/Checkbox/Checkbox';
import { useActions } from '../../../hooks/useActions';
import { TextField, FormControlLabel, Checkbox } from '@mui/material';

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
            <TextField 
                label = "Enter a correct answer"
                size = 'small'
                fullWidth
                sx = {{ marginBottom: '30px' }}
                value={
                    isTextAnswer(question.correctAnswer)
                        ? question.correctAnswer.text : ''
                }
                onChange={correctAnswerChangeHandler}
            />
            <TextField 
                label = "Enter score for a correct answer"
                size = 'small'
                fullWidth
                value = {
                    isTextAnswer(question.correctAnswer) && question.correctAnswer.score
                       ? question.correctAnswer.score : 0
                }
                onChange={scoreChangeHandler}
            />
            {/* <Checkbox
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
            /> */}
            <div className = {style.Footer}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={
                                isTextAnswer(question.correctAnswer)
                                    ? question.correctAnswer.ignoreRegister : false
                            }
                            onChange = {ignoreRegisterChangeHandler}
                        />
                    }
                    label="Ignore register?"
                />
            </div>
        </div>
    );
}

export default TextQuestionConstruct;