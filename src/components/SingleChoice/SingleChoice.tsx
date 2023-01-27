import { FC, useState } from 'react';
import { Answer } from '../../types/survey';
import Radio from '../../UI/Radio/Radio';

interface SingleChoiceProps {
    answers: Answer[];
}

const SingleChoice: FC<SingleChoiceProps> = ({answers}) => {

    const [selectedAnswer, setSelectedAnswer] = useState<Number>();

    const radioHandler = (event: React.ChangeEvent<HTMLInputElement>) => {

        setSelectedAnswer(Number(event.target.value));
    }

    const renderAnswers = () => {
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

    return (
        <>
            { renderAnswers() }
        </>
    );
}

export default SingleChoice;