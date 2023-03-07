import { FC, useState, useEffect } from 'react';
import { useActions } from '../../hooks/useActions';
import {
    IAnswer,
    IQuestion,
    ITextAnswer,
    QuestionType,
    TextFieldType
} from '../../types/survey';
import Input from '../../UI/Input/Input';
import Textarea from '../../UI/Textarea/Textarea';

interface ITextFieldProps {
    id: number;
    type: TextFieldType;
    topic: string;
    required: boolean;
    disabled?: boolean;
    givedAnswer?: ITextAnswer;
    correctAnswer?: ITextAnswer;
}

const TextField: FC<ITextFieldProps> = ({
    id,
    type,
    topic,
    correctAnswer,
    required,
    disabled,
    givedAnswer
}) => {
    const [text, setText] = useState<string>('');
    const { updateAnswersQuestions } = useActions();

    console.log(givedAnswer);

    useEffect(() => {
        if (givedAnswer) {
            setText(givedAnswer.text);
        }
        // eslint-disable-next-line
    }, [])

    const updateTextAnswer = (value: string, type: QuestionType) => {
        setText(value);
        let answer: IAnswer;

        if (correctAnswer) {
            const earnedScore =
                correctAnswer.text.toLowerCase() === value.toLowerCase()
                    ? correctAnswer.score
                    : 0;

            answer = { text: value, score: earnedScore };
        } else {
            answer = { text: value };
        }

        const question: IQuestion = { id, topic, type, correctAnswer, required };
        updateAnswersQuestions({ question, answer });
    }

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateTextAnswer(event.target.value, QuestionType.ShortTextField);
    }


    const textareaChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateTextAnswer(event.target.value, QuestionType.DetailedTextField);
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
        if (type === TextFieldType.Short) {
            return <Input
                string={text}
                onChangeHandler={inputChangeHandler}
                disabled={disabled}
                width={'100%'}
                border={getBorder()}
            />
        }

        else if (type === TextFieldType.Detailed) {
            return <Textarea
                text={text}
                onChangeHandler={textareaChangeHandler}
                disabled={disabled}
                width={'100%'}
                height={'100px'}
            />
        }
    }

    return (
        <>
            {renderTextField()}
        </>
    );
}

export default TextField;