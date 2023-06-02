import { FC, useState, useEffect } from 'react';
import { isOption, isSetOfOptions } from '../../helper';
import { useActions } from '../../hooks/useActions';
import { IAnswer, IOption, IQuestion } from '../../types/survey';
import { Radio, FormControlLabel } from '@mui/material';
import style from './SingleChoice.module.scss';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

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

    const renderCheckmark = () => <span className={style.Checkmark}> <CheckCircleIcon /> </span>
    
    const renderCrossmark = () => <span className={style.Crossmark}> <CloseIcon /> </span>

    const renderOption = (option: IOption) => {
        return (
            <li className={style.Option} key={option.id}>
                <FormControlLabel 
                    value={String(option.id)} 
                    control={
                        <Radio
                            checked={selectedOptionId === option.id}
                            onChange={radioHandler}
                            name="radio-buttons"
                            inputProps={{ 'aria-label': option.label }}
                            disabled = {selectedOption !== undefined}
                        />
                    } 
                    label={option.label}
                />

                {
                    selectedOption && selectedOption.id === option.id 
                    ? renderMark(selectedOption) : null
                } 
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