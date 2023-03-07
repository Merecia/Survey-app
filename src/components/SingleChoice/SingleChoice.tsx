import { FC, useState, useEffect } from 'react';
import { isOption } from '../../helper';
import { useActions } from '../../hooks/useActions';
import { IAnswer, IOption, IQuestion, QuestionType } from '../../types/survey';
import Radio from '../../UI/Radio/Radio';
import style from './SingleChoice.module.scss';

interface ISingleChoiceProps {
    id: number;
    topic: string;
    required: boolean;
    options: IOption[];
    disabled?: boolean;
    selectedOption?: number;
}

const SingleChoice: FC<ISingleChoiceProps> = ({
    id,
    options,
    topic,
    required,
    disabled,
    selectedOption
}) => {
    const { updateAnswersQuestions } = useActions();
    const [selectedOptionId, setSelectedOptionId] = useState<Number>();

    useEffect(() => {
        if (selectedOption) {
            setSelectedOptionId(selectedOption);
        }
    }, [])

    const radioHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedOptionId = Number(event.target.value);
        setSelectedOptionId(selectedOptionId);

        const selectedOption = options.find(option => option.id === selectedOptionId);

        const question: IQuestion = {
            id, topic, required, options,
            type: QuestionType.OneChoice
        };

        const option: IOption = {
            id: selectedOptionId,
            label: selectedOption?.label || '',
            score: selectedOption?.score
        };

        updateAnswersQuestions({
            question,
            answer: option
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
        return isCorrectOption(option) ? renderCheckmark() : renderCrossmark()
    }

    const renderCheckmark = () => {
        return <span className = {style.Checkmark}> &#10003; </span>
    }

    const renderCrossmark = () => {
        return <span className = {style.Crossmark}> &#10060; </span>
    }

    const renderOptions = () => {
        return options.map((option: IOption) =>
            <div className = {style.Option}>
                <Radio
                    key={option.id}
                    id={option.id}
                    label={option.label}
                    onChangeHandler={radioHandler}
                    checked={selectedOptionId === option.id}
                    disabled={disabled}
                />
                {selectedOptionId === option.id ? renderMark(option) : null}
            </div>
        );
    }

    return (
        <>
            {renderOptions()}
        </>
    );
}

export default SingleChoice;