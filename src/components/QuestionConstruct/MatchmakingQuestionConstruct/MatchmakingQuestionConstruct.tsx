import React, { FC } from 'react';
import { IOption, IQuestion } from '../../../types/survey';
import style from './MatchmakingQuestionConstruct.module.scss';
import Input from '../../../UI/Input/Input';
import { isMatches } from '../../../helper';
import { useActions } from '../../../hooks/useActions';
// import Select from '../../../UI/Select/Select';
// import Button from '../../../UI/Button/Button';
import { IconButton, TextField, Button, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface IMatchmakingQuestionConstructProps {
    question: IQuestion;
    cssProperties?: React.CSSProperties;
}

const MatchmakingQuestionConstruct: FC<IMatchmakingQuestionConstructProps> = ({
    question,
    cssProperties
}) => {
    const { updateQuestion } = useActions();

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

    // const renderQuestionTypes = () => {
    //     return Object.keys(questionTypes).map(typeName => {
    //         return <MenuItem value = {typeName}> {typeName} </MenuItem>
    //     });
    // }

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
                {/* <Input
                    value={option.label || ''}
                    onChangeHandler={
                        (event: React.ChangeEvent<HTMLInputElement>) => leftListOptionChangeHandler(option, event)
                    }
                    cssProperties={{ marginLeft: '5px', marginRight: '10px' }}
                /> */}
                <TextField 
                    size = 'small'
                    sx = {{ marginLeft: '5px', marginRight: '10px' }}
                    value={option.label || ''}
                    onChange={
                        (event: React.ChangeEvent<HTMLInputElement>) => leftListOptionChangeHandler(option, event)
                    }
                />
                {/* <Select
                    id={option.id}
                    value={String(option.relatedOptionId) || '1'}
                    options={
                        isMatches(question.options)
                            ? question.options.rightList.map(option => String(option.id))
                            : ['1']
                    }
                    onChangeHandler={(event) => relatedOptionChangeHandler(option, event)}
                    cssProperties={{ marginRight: '10px' }}
                /> */}
                <TextField
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
                <IconButton 
                    aria-label="delete" 
                    onClick={() => removeLeftListOption(option)}
                >
                    <DeleteIcon />
                </IconButton>
                {/* <Button
                    label='x'
                    clickHandler={() => removeLeftListOption(option)}
                /> */}
            </div>
        );
    }

    const renderRightListOption = (option: IOption) => {
        return (
            <div className={style.Option} key={option.id}>
                <span> {option.id} </span>
                <Input
                    value={option.label || ''}
                    onChangeHandler={
                        (event: React.ChangeEvent<HTMLInputElement>) => rightListOptionChangeHandler(option, event)
                    }
                    cssProperties={{ marginRight: '10px' }}
                />
                <IconButton 
                    aria-label="delete" 
                    onClick={() => removeRightListOption(option)}
                >
                    <DeleteIcon />
                </IconButton>
            </div>
        )
    }

    const addNewLeftListOption = () => {
        if (isMatches(question.options)) {
            const lastId = question.options.leftList.length;
            const newOption = {
                id: lastId + 1,
                label: '',
                score: question.options.leftList[0].score,
                relatedOptionId: 1
            };

            const updatedLeftList = [...question.options.leftList];
            updatedLeftList.push(newOption);
            updateLeftList(updatedLeftList);
        }
    }

    const addNewRightListOption = () => {
        if (isMatches(question.options)) {
            const lastId = question.options.rightList.length;
            const updatedRightList = [...question.options.rightList];
            const newOption = {
                id: lastId + 1,
                label: ''
            };

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
                    {/* <Button
                        label={'Add new option'}
                        clickHandler={addNewLeftListOption}
                        cssProperties={{ marginTop: '10px', width: '100%' }}
                    /> */}
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
                <p> Enter the score for the correct answer: </p>
                <Input 
                    value = {
                        isMatches(question.options) && question.options.leftList[0].score 
                            ? question.options.leftList[0].score : 1
                    }
                    onChangeHandler={matchesScoreChangeHandler}
                    type = {'number'}
                />

            </div>
        </div>
    );
}

export default MatchmakingQuestionConstruct;