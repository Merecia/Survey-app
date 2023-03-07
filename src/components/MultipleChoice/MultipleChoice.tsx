import { FC, useState, useEffect } from 'react';
import { isOption, remove } from '../../helper';
import { useActions } from '../../hooks/useActions';
import { IAnswer, IOption, IQuestion, QuestionType } from '../../types/survey';
import Checkbox from '../../UI/Checkbox/Checkbox';
import style from './MultipleChoice.module.scss';

interface ISingleChoiceProps {
    id: number;
    options: IOption[];
    topic: string;
    required: boolean;
    disabled?: boolean;
    selectedOptions?: number[];
}

const MultipleChoice: FC<ISingleChoiceProps> = ({
    id,
    options,
    topic,
    required,
    disabled,
    selectedOptions
}) => {
    const [selectedOptionsId, setSelectedOptionsId] = useState<number[]>([]);
    const { updateAnswersQuestions } = useActions();

    useEffect(() => {
        if (selectedOptions) {
            setSelectedOptionsId(selectedOptions);
        }
    }, [])

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
            id, topic, options, required,
            type: QuestionType.MultipleChoice,
        }

        updateAnswersQuestions({
            question: question,
            answer: answers
        });
    }

    const isCorrectOption = (option: IAnswer) => {
        if (isOption(option)) {
            if (option.score && option.score > 0) {
                return  true;
            }
            return false;
        }
        return undefined;
    }

    const renderMark = (option: IAnswer) => {
        return isCorrectOption(option) ? renderCheckmark() : renderCrossmark();
    }

    const renderCheckmark = () => <span className = {style.Checkmark}> &#10003; </span>

    const renderCrossmark = () => <span className = {style.Crossmark}> &#10060; </span>

    const renderOptions = () => {
        return options.map((answer: IOption) => 
            <div className = {style.Option}>
                <Checkbox
                    key={answer.id}
                    id={answer.id}
                    label={answer.label}
                    onChangeHandler={checkboxHandler}
                    checked={selectedOptionsId.includes(answer.id)}
                    disabled={disabled}
                />

                {selectedOptionsId.includes(answer.id) ? renderMark(answer) : null}
            </div>
        );
    }

    return (
        <>
            {renderOptions()}
        </>
    );
}

export default MultipleChoice;