import { FC, useState, useEffect } from 'react';
import { isOption, isSetOfOptions, remove } from '../../helper';
import { useActions } from '../../hooks/useActions';
import { IAnswer, IOption, IQuestion } from '../../types/survey';
import Checkbox from '../../UI/Checkbox/Checkbox';
import style from './MultipleChoice.module.scss';

interface IMultipleChoiceProps {
    question: IQuestion;
    selectedOptions?: IOption[];
}

const MultipleChoice: FC<IMultipleChoiceProps> = ({ question, selectedOptions }) => {
    const [selectedOptionsId, setSelectedOptionsId] = useState<number[]>([]);
    const { updateAnswersToQuestions } = useActions();

    useEffect(() => {
        if (selectedOptions) {
            setSelectedOptionsId(selectedOptions.map(selectedOption => selectedOption.id));
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

        const answer: IOption[] = newSelectedOptionsId.map(selectedOptionId => {
            const selectedOption = isSetOfOptions(question.options)
                ? question.options.find(option => option.id === selectedOptionId)
                : null;

            return {
                id: selectedOptionId,
                label: selectedOption?.label || '',
                score: selectedOption?.score || 0
            };
        })

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

    const renderMark = (option: IAnswer) => isCorrectOption(option) ? renderCheckmark() : renderCrossmark()

    const renderCheckmark = () => <span className={style.Checkmark}> &#10003; </span>

    const renderCrossmark = () => <span className={style.Crossmark}> &#10060; </span>

    const renderOption = (option: IOption) => {
        return (
            <div className={style.Option} key = {option.id}>
                <Checkbox
                    value={String(option.id)}
                    label={option.label}
                    onChangeHandler={checkboxHandler}
                    checked={selectedOptionsId.includes(option.id)}
                    disabled={false}
                />

                {
                    selectedOptions?.map(selectedOption => selectedOption.id).includes(option.id) 
                        ? renderMark(option) 
                        : null
                }
            </div>
        );
    }

    const renderOptions = () => {
        return (
            <ul className = {style.Options}>
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

export default MultipleChoice;