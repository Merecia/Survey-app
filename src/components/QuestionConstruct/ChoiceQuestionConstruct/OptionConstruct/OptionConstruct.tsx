import React, { FC, useMemo } from 'react';
import style from './OptionConstruct.module.scss';
import { IOption, IQuestion } from '../../../../types/survey';
import { TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useActions } from '../../../../hooks/useActions';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { isSetOfOptions } from '../../../../helper';

interface IOptionContructProps {
    question: IQuestion;
    option: IOption;
    cssProperties?: React.CSSProperties;
}

const OptionConstruct: FC<IOptionContructProps> = ({ question, option, cssProperties }) => {
    const { updateQuestion } = useActions();
    const { surveyInfo } = useTypedSelector(state => state.survey);

    const optionChangeHandler = (
        option: IOption,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        option.label = event.target.value;
        updateOption(option);
    }

    const scoreChangeHandler = (
        option: IOption,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        option.score = Number(event.target.value);
        updateOption(option);
    }

    const updateOption = (updatedOption: IOption) => {
        if (isSetOfOptions(question.options)) {
            question.options[updatedOption.id - 1] = updatedOption;
            updateQuestion(question);
        }
    }

    const updateOptions = (updatedOptions: IOption[]) => {
        if (isSetOfOptions(question.options)) {
            question.options = updatedOptions;
            updateQuestion(question);
        }
    }

    const deleteOption = (option: IOption) => {
        if (isSetOfOptions(question.options)) {
            const updatedOptions = question.options
                .filter(item => item.id !== option.id)
                .map((item, index) => {
                    return {
                        id: index + 1,
                        label: item.label,
                        score: item.score
                    }
                })

            updateOptions(updatedOptions);
        }
    }

    const renderLabel = (label: string) => (
        <TextField
            size='small'
            sx={{
                marginLeft: '12px',
                marginRight: '10px',
                width: surveyInfo.isEvaluated ? '75%' : '88%'
            }}
            value={label || ''}
            onChange={
                (event: React.ChangeEvent<HTMLInputElement>) => optionChangeHandler(option, event)
            }
        />
    )

    const renderScore = (score: number | undefined) => {
        if (surveyInfo.isEvaluated) return (
            <TextField
                size='small'
                value={score || 0}
                onChange={
                    (event: React.ChangeEvent<HTMLInputElement>) => scoreChangeHandler(option, event)
                }
                sx={{ marginLeft: '3px', marginRight: '5px', width: '10%' }}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
        );
    }

    const renderDeleteButton = () => (
        <IconButton
            aria-label="delete"
            onClick={() => deleteOption(option)}
        >
            <DeleteIcon />
        </IconButton>
    )

    return (
        <div className={style.Option} key={option.id} style={cssProperties}>
            <span> {option.id} </span>
            {useMemo(() => renderLabel(option.label), [option.label])}
            {useMemo(() => renderScore(option.score), [option.score])}
            {useMemo(() => renderDeleteButton(), [])}
        </div>
    );
}

export default React.memo(OptionConstruct);