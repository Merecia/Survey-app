import React, { FC } from 'react';
import { IOption, IQuestion } from '../../../types/survey';
import style from './MatchmakingQuestionConstruct.module.scss';
import { isMatches } from '../../../helper';
import { useActions } from '../../../hooks/useActions';
import { IconButton, TextField, Button, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTypedSelector } from '../../../hooks/useTypedSelector';

interface IMatchmakingQuestionConstructProps {
    question: IQuestion;
    cssProperties?: React.CSSProperties;
}

const MatchmakingQuestionConstruct: FC<IMatchmakingQuestionConstructProps> = ({
    question,
    cssProperties
}) => {
    const { updateQuestion } = useActions();
    const { surveyInfo } = useTypedSelector(state => state.survey);

    const renderLeftList = (leftList: IOption[]) => {
        return leftList.map(option => renderLeftListOption(option));
    }

    const renderRightList = (rightList: IOption[]) => {
        return rightList.map(option => renderRightListOption(option));
    }

    const updateLeftListOption = (updatedOption: IOption) => {
        if (isMatches(question.options)) {
            question.options.leftList[updatedOption.id - 1] = updatedOption;
            updateQuestion(question);
        }
    }

    const updateRightListOption = (updatedOption: IOption) => {
        if (isMatches(question.options)) {
            question.options.rightList[updatedOption.id - 1] = updatedOption;
            updateQuestion(question);
        }
    }

    const updateLeftList = (leftList: IOption[]) => {
        if (isMatches(question.options)) {
            question.options.leftList = leftList;
            updateQuestion(question);
        }
    }

    const updateRightList = (rightList: IOption[]) => {
        if (isMatches(question.options)) {
            question.options.rightList = rightList;
            updateQuestion(question);
        }
    }

    const leftListOptionChangeHandler = (
        option: IOption,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        option.label = event.target.value;
        updateLeftListOption(option);
    }

    const matchesScoreChangeHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (isMatches(question.options)) {
            question.options.leftList = question.options.leftList.map(option => {
                return {
                    id: option.id,
                    label: option.label,
                    relatedOptionId: option.relatedOptionId,
                    score: Number(event.target.value)
                };
            });
            updateQuestion(question);
        }
    }

    const rightListOptionChangeHandler = (
        option: IOption,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        option.label = event.target.value;
        updateRightListOption(option);
    }

    const relatedOptionChangeHandler = (
        option: IOption,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        option.relatedOptionId = Number(event.target.value);
        updateLeftListOption(option);
    }

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

    const renderPossibleRelatedOptions = () => {
        if (isMatches(question.options)) {
            return question.options.rightList.map(option => {
                return <MenuItem value = {option.id}> {option.id} </MenuItem>
            });
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

    const renderLeftListOption = (option: IOption) => {
        return (
            <div className={style.Option} key={option.id}>
                <span> {option.id} </span>
                <TextField 
                    size = 'small'
                    sx = {{ 
                        marginLeft: '5px', 
                        marginRight: '10px', 
                        width: surveyInfo.isEvaluated ? '64%' : '80%' 
                    }}
                    value={option.label || ''}
                    onChange={
                        (event: React.ChangeEvent<HTMLInputElement>) => leftListOptionChangeHandler(option, event)
                    }
                />
                { 
                    surveyInfo.isEvaluated
                    ? <TextField
                        size = 'small'
                        value={String(option.relatedOptionId) || '1'}
                        onChange = {
                            (event: React.ChangeEvent<HTMLInputElement>) => 
                            relatedOptionChangeHandler(option, event)
                        }
                        select
                    >
                        { renderPossibleRelatedOptions() }
                    </TextField> 
                    : null
                }
                
                <IconButton 
                    aria-label="delete" 
                    onClick={() => removeLeftListOption(option)}
                >
                    <DeleteIcon />
                </IconButton>
            </div>
        );
    }

    const renderRightListOption = (option: IOption) => {
        return (
            <div className={style.Option} key={option.id}>
                <span> {option.id} </span>
                <TextField 
                    size = 'small'
                    sx = {{ marginLeft: '5px', marginRight: '10px', width: '73%' }}
                    value={option.label || ''}
                    onChange={
                        (event: React.ChangeEvent<HTMLInputElement>) => rightListOptionChangeHandler(option, event)
                    }
                />
                <IconButton 
                    aria-label="delete" 
                    onClick={() => removeRightListOption(option)}
                >
                    <DeleteIcon />
                </IconButton>
            </div>
        );
    }

    const addNewLeftListOption = () => {
        if (isMatches(question.options)) {
            const lastId = question.options.leftList.length;
            const newOption: IOption = { id: lastId + 1, label: '' };

            if (surveyInfo.isEvaluated) {
                newOption.relatedOptionId = 1;
                newOption.score = question.options.leftList[0].score;
            }

            const updatedLeftList = [...question.options.leftList];
            updatedLeftList.push(newOption);
            updateLeftList(updatedLeftList);
        }
    }

    const addNewRightListOption = () => {
        if (isMatches(question.options)) {
            const lastId = question.options.rightList.length;
            const updatedRightList = [...question.options.rightList];
            const newOption = { id: lastId + 1, label: '' };

            updatedRightList.push(newOption);
            updateRightList(updatedRightList);
        }
    }

    return (
        <div
            className={style.MatchmakingQuestionConstruct}
            style={cssProperties}
        >
            <div className={style.Matches}>
                <div className={style.LeftList}>
                    {
                        isMatches(question.options)
                            ? renderLeftList(question.options.leftList)
                            : null
                    }
                    <Button 
                        variant = 'contained' 
                        onClick = {addNewLeftListOption}
                        sx = {{ marginTop: '10px', width: '100%' }}
                    > 
                        Add a new option
                    </Button>
                </div>
                <div className={style.RightList}>
                    {
                        isMatches(question.options)
                            ? renderRightList(question.options.rightList)
                            : null
                    }
                    <Button 
                        variant = 'contained' 
                        onClick = {addNewRightListOption}
                        sx = {{ marginTop: '10px', width: '100%' }}
                    > 
                        Add a new option
                    </Button>
                </div>
            </div>
            <div className = {style.Footer}>
                {
                    surveyInfo.isEvaluated
                    ? <TextField 
                        label = "Enter score for a correct answer"
                        size = 'small'
                        fullWidth
                        value = {
                            isMatches(question.options) && question.options.leftList[0].score 
                                ? question.options.leftList[0].score : 0
                        }
                        onChange={matchesScoreChangeHandler}
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    />
                    : null
                }
            </div>
        </div>
    );
}

export default MatchmakingQuestionConstruct;