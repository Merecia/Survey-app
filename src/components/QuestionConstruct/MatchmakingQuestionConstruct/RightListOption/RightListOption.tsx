import React, { FC, useMemo } from 'react';
import { IOption, IQuestion } from '../../../../types/survey';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, TextField } from '@mui/material';
import { isMatches } from '../../../../helper';
import { useActions } from '../../../../hooks/useActions';

interface IRightListOptionProps {
    question: IQuestion;
    option: IOption;
    cssProperties?: React.CSSProperties;
}

const RightListOption: FC<IRightListOptionProps> = ({
    question,
    option,
    cssProperties
}) => {
    const { updateQuestion } = useActions();

    const rightListOptionChangeHandler = (
        option: IOption,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        option.label = event.target.value;
        updateRightListOption(option);
    }

    const updateRightList = (rightList: IOption[]) => {
        if (isMatches(question.options)) {
            question.options.rightList = rightList;
            updateQuestion(question);
        }
    }

    const updateRightListOption = (updatedOption: IOption) => {
        if (isMatches(question.options)) {
            question.options.rightList[updatedOption.id - 1] = updatedOption;
            updateQuestion(question);
        }
    }

    const removeRightListOption = (option: IOption) => {
        if (isMatches(question.options)) {
            const rightList = question.options.rightList
                .filter(item => item.id !== option.id)
                .map((item, index) => {
                    return {
                        id: index + 1,
                        label: item.label
                    }
                });

            updateRightList(rightList);
        }
    }

    const renderLabel = (label: string) => (
        <TextField
            size='small'
            sx={{ marginLeft: '5px', marginRight: '10px', width: '73%' }}
            value={label || ''}
            onChange={
                (event: React.ChangeEvent<HTMLInputElement>) => rightListOptionChangeHandler(option, event)
            }
        />
    )

    const renderDeleteButton = () => (
        <IconButton
            aria-label="delete"
            onClick={() => removeRightListOption(option)}
        >
            <DeleteIcon />
        </IconButton>
    )

    return (
        <div key={option.id} style={cssProperties}>
            <span> {option.id} </span>
            { useMemo(() => renderLabel(option.label), [option.label]) }
            { useMemo(() => renderDeleteButton(), []) }
        </div>
    );
}

export default React.memo(RightListOption);