import { FC, useState } from 'react';
import { remove } from '../../helper';
import { Answer } from '../../types/survey';
import Checkbox from '../../UI/Checkbox/Checkbox';

interface SingleChoiceProps {
    answers: Answer[];
}

const MultipleChoice: FC<SingleChoiceProps> = ({answers}) => {

    const [selectedAnswers, setSelectedAnswers] = useState<Number[]>([]);

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

    return (
        <>
            { renderAnswers() }
        </>
    );
}

export default MultipleChoice;