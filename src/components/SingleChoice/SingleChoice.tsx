import { FC, useState, useEffect } from 'react';
import { isOption, isSetOfOptions } from '../../helper';
import { useActions } from '../../hooks/useActions';
import { IAnswer, IOption, IQuestion } from '../../types/survey';
import Radio from '../../UI/Radio/Radio';
import style from './SingleChoice.module.scss';

interface ISingleChoiceProps {
    question: IQuestion;
    selectedOption?: IOption;
}

const SingleChoice: FC<ISingleChoiceProps> = ({ question, selectedOption }) => {
    const { updateAnswersToQuestions } = useActions();
    const [selectedOptionId, setSelectedOptionId] = useState<Number>();

    useEffect(() => {
        if (selectedOption) {
            setSelectedOptionId(selectedOption.id);
        }
    }, [])

    const radioHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedOptionId = Number(event.target.value);
        setSelectedOptionId(selectedOptionId);

        const selectedOption = isSetOfOptions(question.options)
            ? question.options.find(option => option.id === selectedOptionId)
            : undefined;

        const answer: IOption = {
            id: selectedOptionId,
            label: selectedOption?.label || '',
            score: selectedOption?.score || 0
        };

        updateAnswersToQuestions({ question, answer });
    }

    const isCorrectOption = (option: IAnswer) => {
        if (isOption(option)) {
            if (option.score && option.score > 0) {
                return true;
            }
            return false;
        }
        return undefined;
    }

    const renderMark = (selectedOption: IAnswer) => {
        return isCorrectOption(selectedOption) ? renderCheckmark() : renderCrossmark();
    }

    const renderCheckmark = () => {
        return <span className={style.Checkmark}> &#10003; </span>
    }

    const renderCrossmark = () => {
        return <span className={style.Crossmark}> &#10060; </span>
    }

    const renderOption = (option: IOption) => {
        return (
            <li className={style.Option} key={option.id}>
                <Radio
                    value={String(option.id)}
                    label={option.label}
                    onChangeHandler={radioHandler}
                    checked={selectedOptionId === option.id}
                    disabled={false}
                />

                {selectedOption ? renderMark(selectedOption) : null} 
            </li>
        );
    }

    const renderOptions = () => {
        return (
            <ul className={style.Options}>
                {
                    isSetOfOptions(question.options) 
                    ? question.options.map(option => renderOption(option))
                    : null
                }
            </ul>
        );
    }

    return renderOptions();
}

export default SingleChoice;