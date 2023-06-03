import { FC, useState, useEffect } from 'react';
import { isOption, isSetOfOptions, remove } from '../../helper';
import { useActions } from '../../hooks/useActions';
import { IAnswer, IOption, IQuestion } from '../../types/survey';
import { Checkbox, FormControlLabel } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import style from './MultipleChoice.module.scss';

interface IMultipleChoiceProps {
    question: IQuestion;
    selectedOptions?: IOption[];
}

const MultipleChoice: FC<IMultipleChoiceProps> = ({ question, selectedOptions }) => {
    const [selectedOptionsId, setSelectedOptionsId] = useState<number[]>([]);
    const { updateAnswerToQuestion } = useActions();

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

            const answer: IOption = {
                id: selectedOptionId,
                label: selectedOption?.label || ''
            };
    
            if (selectedOption && selectedOption.score) {
                answer.score = selectedOption.score;
            } 

            return answer;
        })

        updateAnswerToQuestion({ question, answer });
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

    const renderCheckmark = () => <span className={style.Checkmark}> <CheckCircleIcon /> </span>

    const renderCrossmark = () => <span className={style.Crossmark}> <CloseIcon /> </span>

    const renderOption = (option: IOption) => {
        return (
            <div className={style.Option} key={option.id}>
                <FormControlLabel
                    value={String(option.id)}
                    control={
                        <Checkbox
                            checked={selectedOptionsId.includes(option.id)}
                            onChange={checkboxHandler}
                            name="checkbox-button"
                            inputProps={{ 'aria-label': option.label }}
                            disabled={selectedOptions !== undefined}
                        />
                    }
                    label={option.label}
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

export default MultipleChoice;