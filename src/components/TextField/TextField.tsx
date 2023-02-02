import { FC, useState } from 'react';
import { useActions } from '../../hooks/useActions';
import { Answer, IQuestion, ITextAnswer, QuestionType, TextFieldType } from '../../types/survey';
import Input from '../../UI/Input/Input';
import Textarea from '../../UI/Textarea/Textarea';

interface TextFieldProps {
    id: number;
    type: TextFieldType;
    correctAnswer?: ITextAnswer;
    topic: string;
}

const TextField: FC<TextFieldProps> = ({ id, type, topic, correctAnswer }) => {

    const [text, setText] = useState<string>('');

    const {updateAnswersQuestions} = useActions();

    const updateTextAnswer = (value: string, type: QuestionType) => {

        setText(value);

        let answer: Answer;

        if (correctAnswer) {

            const earnedScore = correctAnswer.text === value ? correctAnswer.score : 0;

            answer = {text: value, score: earnedScore};

        } else {

            answer = {text: value};
        }

        const question: IQuestion = {id, topic, type, correctAnswer};

        updateAnswersQuestions({
            question,
            answer
        });
    }

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateTextAnswer(event.target.value, QuestionType.ShortTextField);        
    }


    const textareaChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
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