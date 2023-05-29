import React, { FC } from 'react';
import { IOption, IQuestion } from '../../../types/survey';
import { isSetOfOptions } from '../../../helper';
import style from './ChoiceQuestionConstruct.module.scss';
import Input from '../../../UI/Input/Input';
// import Button from '../../../UI/Button/Button';
import { useActions } from '../../../hooks/useActions';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { TextField, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface IChoiceQuestionConstructProps {
    question: IQuestion;
    cssProperties?: React.CSSProperties;
}

const ChoiceQuestionConstruct: FC<IChoiceQuestionConstructProps> = ({
    question,
    cssProperties
}) => {
    const { updateQuestion } = useActions();

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

    const addEmptyOption = () => {
        if (isSetOfOptions(question.options)) {
            const lastId = question.options.length;
            const updatedOptions = [...question.options];
            updatedOptions.push({
                id: lastId + 1,
                label: '',
                score: 0
            });

            updateOptions(updatedOptions);
        }
    }

    const renderOption = (option: IOption) => {
        return (
            <div className={style.Option} key={option.id}>
                <span> {option.id} </span>
                {/* <Input
                    value={option.label || ''}
                    onChangeHandler={
                        (event: React.ChangeEvent<HTMLInputElement>) => optionChangeHandler(option, event)
                    }
                    cssProperties={{ marginLeft: '5px', marginRight: '10px' }}
                /> */}
                <TextField 
                    size = 'small'
                    sx = {{ marginLeft: '12px', marginRight: '10px', width: '75%' }}
                    value={option.label || ''}
                    onChange={
                        (event: React.ChangeEvent<HTMLInputElement>) => optionChangeHandler(option, event)
                    }
                />
                <TextField 
                    size = 'small'
                    value = {option.score || 0}
                    onChange={
                        (event: React.ChangeEvent<HTMLInputElement>) => scoreChangeHandler(option, event)
                    }
                    sx = {{ marginLeft: '3px', marginRight: '5px', width: '10%' }}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                />
                {/* <Input
                    value={option.score || 0}
                    onChangeHandler={
                        (event: React.ChangeEvent<HTMLInputElement>) => scoreChangeHandler(option, event)
                    }
                    type='number'
                    cssProperties={{ marginRight: '10px' }}
                /> */}
                {/* <Button
                    label='Delete'
                    clickHandler={() => deleteOption(option)}
                /> */}
                {/* <Button 
                    variant="outlined" 
                    startIcon={<DeleteIcon />}
                    onClick={() => deleteOption(option)}
                >
                    Delete
                </Button> */}
                <IconButton 
                    aria-label="delete" 
                    onClick={() => deleteOption(option)}
                >
                    <DeleteIcon />
                </IconButton>
            </div>
        );
    }

    const renderOptions = () => {
        if (isSetOfOptions(question.options)) {
            return question.options.map(option => renderOption(option));
        }
    }

    return (
        <div className={style.ChoiceQuestionConstruct} style={cssProperties}>
            <div className = {style.Header}>
                <p className = {style.NumberLabel}> # </p>
                <p className = {style.OptionLabel}> Option </p>
                <p className = {style.ScoreLabel}> Score </p>
            </div>
            {renderOptions()}
            {/* <Button
                label={"Add a new option"}
                clickHandler={addEmptyOption}
                cssProperties={{
                    width: '100%', 
                    marginTop: '10px', 
                    padding: '5px'
                }}
            /> */}

            <Button 
                variant = 'contained' 
                onClick = {addEmptyOption}
                sx = {{
                    width: '100%', 
                    marginTop: '10px', 
                    padding: '5px'
                 }}
            > 
                Add a new option
            </Button>
        </div>
    );
}

export default ChoiceQuestionConstruct;