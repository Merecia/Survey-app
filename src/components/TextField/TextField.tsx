import React, { FC, useState, useEffect } from 'react';
import { isTextAnswer } from '../../helper';
import { useActions } from '../../hooks/useActions';
import {
    IAnswer, 
    IQuestion, 
    ITextAnswer,
    QuestionType
} from '../../types/survey';
import { TextField as TextInput } from '@mui/material';

interface ITextFieldProps {
    question: IQuestion;
    givedAnswer?: ITextAnswer;
}

const TextField: FC<ITextFieldProps> = ({ question, givedAnswer }) => {
    const [text, setText] = useState<string>('');
    const { updateAnswerToQuestion } = useActions();

    useEffect(() => {
        if (givedAnswer) {
            setText(givedAnswer.text);
        }
        // eslint-disable-next-line
    }, [])

    const updateTextAnswer = (value: string) => {
        setText(value);

        let answer: IAnswer;
        const correctAnswer = question.correctAnswer;

        if (isTextAnswer(correctAnswer)) {
            let earnedScore: number = 0;

            if (correctAnswer.ignoreRegister) {
                if (correctAnswer.text.toLowerCase() === value.toLowerCase()) {
                    earnedScore = correctAnswer.score || 0;
                }
            } else {
                if (correctAnswer.text === value) {
                    earnedScore = correctAnswer.score || 0;
                }
            }
            
            answer = { text: value, score: earnedScore };
            
        } else answer = { text: value };

        updateAnswerToQuestion({ question, answer });
    }

    const textInputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateTextAnswer(event.target.value);
    }

    const getBorder = () => {
        const red = 'rgb(247, 84, 81)';
        const green = 'rgb(92,182,96)';

        if (givedAnswer && givedAnswer.score !== undefined) {
            if (givedAnswer.score > 0) {
                return `2px solid ${green}`;
            } else if (givedAnswer.score <= 0) {
                return `2px solid ${red}`;
            }
        } 
    }

    const renderTextField = () => {
        if (question.type === QuestionType.ShortTextField) {
            return (
                <TextInput
                    size='small'
                    fullWidth
                    value={text}
                    onChange={textInputChangeHandler}
                    disabled = {givedAnswer !== undefined}
                    sx = {{ 
                        border: getBorder(),
                        borderRadius: '6px'
                    }}  
                />
            );
        }

        else if (question.type === QuestionType.DetailedTextField) {
            return (
                <TextInput
                    size='small'
                    fullWidth
                    value={text}
                    onChange={textInputChangeHandler}
                    disabled = {givedAnswer !== undefined}
                    sx = {{ 
                        border: getBorder(),
                        borderRadius: '6px'
                    }} 
                    multiline
                    rows={5}
                />
            );
        }

        else return null;
    }

    return renderTextField();
}

export default React.memo(TextField);