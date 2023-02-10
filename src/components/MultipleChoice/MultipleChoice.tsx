import { FC, useState } from 'react';
import { remove } from '../../helper';
import { useActions } from '../../hooks/useActions';
import { IOption, IQuestion, QuestionType } from '../../types/survey';
import Checkbox from '../../UI/Checkbox/Checkbox';

interface ISingleChoiceProps {
    id: number;
    options: IOption[];
    topic: string;
    required: boolean;
}

const MultipleChoice: FC<ISingleChoiceProps> = ({ id, options, topic, required }) => {

    const [selectedOptionsId, setSelectedOptionsId] = useState<number[]>([]);
    const {updateAnswersQuestions} = useActions();

    const checkboxHandler = (event: React.ChangeEvent<HTMLInputElement>) => {

        const selectedOptionId = parseInt(event.target.value);

        let newSelectedOptionsId: number[] = [];

        if (selectedOptionsId.length !== 0) {

            let index = selectedOptionsId.indexOf(selectedOptionId);

            if (index === -1) {

                newSelectedOptionsId = [...selectedOptionsId, selectedOptionId];

            } else {

                newSelectedOptionsId = remove(selectedOptionsId, index);
            }

        } else {

            newSelectedOptionsId = [selectedOptionId];
        }

        setSelectedOptionsId(newSelectedOptionsId);

        const answers: IOption[] = newSelectedOptionsId.map(selectedOptionId => {

            const selectedOption = options.find(option => option.id === selectedOptionId);
            
            return {
                id: selectedOptionId,
                label: selectedOption?.label || '',
                score: selectedOption?.score
            }
        })

        const question: IQuestion = {
            id,
            topic,
            options,
            required,
            type: QuestionType.MultipleChoice,
        }

        updateAnswersQuestions({
            question: question,
            answer: answers
        });
    }

    const renderOptions = () => {
        return options.map((answer: IOption) =>
            <Checkbox
                key={answer.id}
                id={answer.id}
                label={answer.label}
                onChangeHandler={checkboxHandler}
                checked={selectedOptionsId.includes(answer.id)}
            />
        )
    }

    return (
        <>
            {renderOptions()}
        </>
    );
}

export default MultipleChoice;