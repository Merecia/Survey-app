import { FC, useState } from 'react';
import { useActions } from '../../hooks/useActions';
import { IAnswer, IQuestion, ITextAnswer, QuestionType, TextFieldType } from '../../types/survey';
import Input from '../../UI/Input/Input';
import Textarea from '../../UI/Textarea/Textarea';

interface ITextFieldProps {
    id: number;
    type: TextFieldType;
    topic: string;
    required: boolean;
    correctAnswer?: ITextAnswer;
}

const TextField: FC<ITextFieldProps> = ({ 
    id, 
    type, 
    topic, 
    correctAnswer, 
    required 
}) => {

    const [text, setText] = useState<string>('');

    const {updateAnswersQuestions} = useActions();

    const updateTextAnswer = (value: string, type: QuestionType) => {

        setText(value);

        let answer: IAnswer;

        if (correctAnswer) {

            const earnedScore = correctAnswer.text.toLowerCase() === value.toLowerCase() 
                ? correctAnswer.score 
                : 0;

            answer = {text: value, score: earnedScore};

        } else {

            answer = {text: value};
        }

        const question: IQuestion = {id, topic, type, correctAnswer, required};

        updateAnswersQuestions({
            question,
            answer
        });
    }

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateTextAnswer(event.target.value, QuestionType.ShortTextField);        
    }


    const textareaChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateTextAnswer(event.target.value, QuestionType.DetailedTextField);        
    }

    const renderTextField = () => {

        if (type === TextFieldType.Short) {
            return <Input
                string={text}
                onChangeHandler={inputChangeHandler}
                width={'100%'}
            />
        }

        else if (type === TextFieldType.Detailed) {
            return <Textarea
                text={text}
                onChangeHandler={textareaChangeHandler}
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