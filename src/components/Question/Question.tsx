import { FC, useState } from 'react';
import { remove } from '../../helper';
import { Answer, QuestionType } from '../../types/survey';
import Checkbox from '../../UI/Checkbox/Checkbox';
import Radio from '../../UI/Radio/Radio';
import style from './Question.module.scss';

interface QuestionProps {
    answers: Answer[],
    question: string;
    type: QuestionType
}

const Question: FC<QuestionProps> = ({ answers, question, type }) => {

    const [selectedAnswers, setSelectedAnswers] = useState<Number[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<Number>();

    const radioHandler = (event: React.ChangeEvent<HTMLInputElement>) => {

        setSelectedAnswer(Number(event.target.value));
    }

    const checkboxHandler = (event: React.ChangeEvent<HTMLInputElement>) => {

        const answer = Number(event.target.value);

        if (selectedAnswers.length !== 0) {

            let index = selectedAnswers.indexOf(answer);

            if (index === -1) {

                setSelectedAnswers([...selectedAnswers, answer]);

            } else {

                setSelectedAnswers(remove(selectedAnswers, index));
            }

        } else {

            setSelectedAnswers([answer]);
        }
    }

    const renderAnswers = () => {

        if (type === QuestionType.OneChoice) {
            return answers.map((answer: Answer) =>
                <Radio
                    key={answer.id}
                    id={answer.id}
                    label={answer.label}
                    onChangeHandler={radioHandler}
                    checked={selectedAnswer === answer.id}
                />
            )
        }

        else if (type === QuestionType.MultipleChoice) {
            return answers.map((answer: Answer) =>
                <Checkbox
                    key={answer.id}
                    id={answer.id}
                    label={answer.label}
                    onChangeHandler={checkboxHandler}
                    checked={selectedAnswers.includes(answer.id)}
                />
            )
        }
    }

    return (
        <div className={style.Question}>
            <p> {question} </p>
            {renderAnswers()}
        </div>
    );
}

export default Question;