import React, { FC, useMemo } from 'react';
import { IQuestion, ITextAnswer } from '../../../types/survey';
import style from './TextQuestionConstruct.module.scss';
import { isTextAnswer } from '../../../helper';
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

    const renderCorrectAnswerTextField = (correctAnswer: ITextAnswer | undefined) => (
        <TextField
            label="Enter a correct answer"
            size='small'
            fullWidth
            value={isTextAnswer(correctAnswer) ? correctAnswer.text : ''}
            onChange={correctAnswerChangeHandler}
        />
    )

    const renderScoreField = (correctAnswer: ITextAnswer | undefined) => (
        <TextField
            label="Enter score for a correct answer"
            size='small'
            fullWidth
            sx={{ marginTop: '30px' }}
            value={ isTextAnswer(correctAnswer) && correctAnswer.score ? correctAnswer.score : 0 }
            onChange={scoreChangeHandler}
        />
    )

    const renderFooter = (correctAnswer: ITextAnswer | undefined) => {
        return (
            <div className={style.Footer}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={ isTextAnswer(correctAnswer) ? correctAnswer.ignoreRegister : false }
                            onChange={ignoreRegisterChangeHandler}
                        />
                    }
                    label="Ignore register?"
                />
            </div>
        );
    }

    return (
        <div className={style.TextQuestionConstruct} style={cssProperties}>
            { 
                useMemo(
                    () => renderCorrectAnswerTextField(question.correctAnswer), 
                    [question?.correctAnswer?.text]
                ) 
            } 

            { 
                useMemo(
                    () => renderScoreField(question.correctAnswer), 
                    [question?.correctAnswer?.score]
                ) 
            }

            { 
                useMemo(
                    () => renderFooter(question.correctAnswer), 
                    [question?.correctAnswer?.ignoreRegister]
                )
            }
        </div>
    );
}

export default TextQuestionConstruct;