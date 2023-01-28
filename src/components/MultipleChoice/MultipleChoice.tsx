import { FC, useState } from 'react';
import { remove } from '../../helper';
import { useActions } from '../../hooks/useActions';
import { IOption, IQuestion, QuestionType } from '../../types/survey';
import Checkbox from '../../UI/Checkbox/Checkbox';

interface SingleChoiceProps {
    id: number;
    options: IOption[];
    topic: string;
}

const MultipleChoice: FC<SingleChoiceProps> = ({ id, options, topic }) => {

    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    const {updateAnswersQuestions} = useActions();

    const checkboxHandler = (event: React.ChangeEvent<HTMLInputElement>) => {

        const selectedOption = parseInt(event.target.value);

        let updatedSelectedOptions: number[] = [];

        if (selectedOptions.length !== 0) {

            let index = selectedOptions.indexOf(selectedOption);

            if (index === -1) {

                updatedSelectedOptions = [...selectedOptions, selectedOption];

            } else {

                updatedSelectedOptions = remove(selectedOptions, index);
            }

        } else {

            updatedSelectedOptions = [selectedOption];
        }

        setSelectedOptions(updatedSelectedOptions);

        const answers: IOption[] = updatedSelectedOptions.map(selectedOption => {

            const label = options.find(option => option.id === selectedOption)?.label || '';
            
            return {
                id: selectedOption,
                label
            }
        })

        const question: IQuestion = {
            id,
            topic,
            options,
            type: QuestionType.MultipleChoice
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
                checked={selectedOptions.includes(answer.id)}
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