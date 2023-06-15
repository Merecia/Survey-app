import React, { FC, useMemo } from 'react';
import { IOption, IQuestion } from '../../../../types/survey';
import { IconButton, TextField, MenuItem } from '@mui/material';
import { useActions } from '../../../../hooks/useActions';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { isMatches } from '../../../../helper';

interface ILeftListOptionProps {
    question: IQuestion;
    option: IOption;
    cssProperties?: React.CSSProperties;
}

const LeftListOption: FC<ILeftListOptionProps> = ({
    question,
    option,
    cssProperties
}) => {
    const { updateQuestion } = useActions();
    const { surveyInfo } = useTypedSelector(state => state.survey);

    const removeLeftListOption = (option: IOption) => {
        if (isMatches(question.options)) {
            const leftList = question.options.leftList
                .filter(item => item.id !== option.id)
                .map((item, index) => {
                    return {
                        id: index + 1,
                        label: item.label,
                        score: item.score,
                        relatedOptionId: item.relatedOptionId
                    };
                });

            updateLeftList(leftList);
        }
    }

    const updateLeftListOption = (updatedOption: IOption) => {
        if (isMatches(question.options)) {
            question.options.leftList[updatedOption.id - 1] = updatedOption;
            updateQuestion(question);
        }
    }

    const updateLeftList = (leftList: IOption[]) => {
        if (isMatches(question.options)) {
            question.options.leftList = leftList;
            updateQuestion(question);
        }
    }

    const renderPossibleRelatedOptions = () => {
        if (isMatches(question.options)) {
            return question.options.rightList.map(option => {
                return (
                    <MenuItem 
                        key = {option.id} 
                        value={option.id}
                    > 
                        {option.id} 
                    </MenuItem>
                );
            });
        }
    }

    const relatedOptionChangeHandler = (
        option: IOption,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        option.relatedOptionId = Number(event.target.value);
        updateLeftListOption(option);
    }

    const leftListOptionChangeHandler = (
        option: IOption,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        option.label = event.target.value;
        updateLeftListOption(option);
    }

    const renderLabel = (label: string) => (
        <TextField
            size='small'
            sx={{
                marginLeft: '5px',
                marginRight: '10px',
                width: surveyInfo.isEvaluated ? '64%' : '80%'
            }}
            value={label || ''}
            onChange={
                (event: React.ChangeEvent<HTMLInputElement>) => leftListOptionChangeHandler(option, event)
            }
        />
    )

    const renderRelatedOption = (relatedOptionId: number | undefined) => {
        if (surveyInfo.isEvaluated) {
            return (
                <TextField
                    size='small'
                    value={String(relatedOptionId) || '1'}
                    onChange={
                        (event: React.ChangeEvent<HTMLInputElement>) =>
                            relatedOptionChangeHandler(option, event)
                    }
                    select
                >
                    {renderPossibleRelatedOptions()}
                </TextField>
            );
        }
    }

    const renderDeleteButton = () => (
        <IconButton
            aria-label="delete"
            onClick={() => removeLeftListOption(option)}
        >
            <DeleteIcon />
        </IconButton>
    )

    return (
        <div key={option.id} style={cssProperties}>
            <span> {option.id} </span>
            { useMemo(() => renderLabel(option.label), [option.label]) }
            { renderRelatedOption(option?.relatedOptionId) }
            { useMemo(() => renderDeleteButton(), [])}
        </div>
    );
}

export default LeftListOption;