import { FC, useState, useEffect } from 'react';
import { isTextAnswer } from '../../helper';
import { useActions } from '../../hooks/useActions';
import {
    IAnswer, 
    IQuestion, 
    ITextAnswer,
    QuestionType
} from '../../types/survey';
import Input from '../../UI/Input/Input';
import Textarea from '../../UI/Textarea/Textarea';

interface ITextFieldProps {
    question: IQuestion;
    givedAnswer?: ITextAnswer;
}

const TextField: FC<ITextFieldProps> = ({ question, givedAnswer }) => {
    const [text, setText] = useState<string>('');
    const { updateAnswersToQuestions } = useActions();

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

            if (correctAnswer.text.toLowerCase() === value.toLowerCase()) {
                earnedScore = correctAnswer.score || 0;
            }

            answer = { text: value, score: earnedScore };
            
        } else answer = { text: value };

        updateAnswersToQuestions({ question, answer });
    }

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateTextAnswer(event.target.value);
    }


    const textareaChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateTextAnswer(event.target.value);
    }

    const getBorder = () => {
        if (givedAnswer && givedAnswer.score !== undefined) {
            if (givedAnswer.score > 0) {
                return `2px solid green`;
            } else if (givedAnswer.score <= 0) {
                return `2px solid red`;
            }
        } else {
            return '1px solid black';
        }
    }

    const renderTextField = () => {
        if (question.type === QuestionType.ShortTextField) {
            return (
                <Input
                    value={text}
                    onChangeHandler={inputChangeHandler}
                    disabled={false}
                    cssProperties={{ 'width': '100%', 'border': getBorder() }}
                />
            );
        }

        else if (question.type === QuestionType.DetailedTextField) {
            return (
                <Textarea
                    value={text}
                    onChangeHandler={textareaChangeHandler}
                    disabled={false}
                    cssProperties={{ 'width': '100%', 'height': '100px' }}
                />
            );
        }

        else return null;
    }

    return renderTextField();
}

export default TextField;