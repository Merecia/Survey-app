import React, { FC } from 'react';
import { IOption, IQuestion } from '../../../types/survey';
import { isSetOfOptions } from '../../../helper';
import style from './ChoiceQuestionConstruct.module.scss';
import { useActions } from '../../../hooks/useActions';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { Button } from '@mui/material';
import OptionConstruct from './OptionConstruct/OptionConstruct';

interface IChoiceQuestionConstructProps {
    question: IQuestion;
    cssProperties?: React.CSSProperties;
}

const ChoiceQuestionConstruct: FC<IChoiceQuestionConstructProps> = ({
    question,
    cssProperties
}) => {
    const { updateQuestion } = useActions();
    const { surveyInfo } = useTypedSelector(state => state.survey);

    const addEmptyOption = () => {
        if (isSetOfOptions(question.options)) {
            const lastId = question.options.length;
            const updatedOptions = [...question.options];
            const newOption: IOption = { id: lastId + 1, label: '' };

            if (surveyInfo.isEvaluated) newOption.score = 0;

            updatedOptions.push(newOption);
            updateOptions(updatedOptions);
        }
    }

    const updateOptions = (updatedOptions: IOption[]) => {
        if (isSetOfOptions(question.options)) {
            question.options = updatedOptions;
            updateQuestion(question);
        }
    }

    const renderOption = (option: IOption) => (
        <OptionConstruct 
            question = {question}
            key = {option.id}
            option = {option}
            cssProperties={{
                width: '100%',
                marginBottom: '10px'
            }}
        />
    )

    const renderOptions = (options: any) => {
        if (isSetOfOptions(options)) {
            return options.map(option => renderOption(option));
        }
    }

    return (
        <div className={style.ChoiceQuestionConstruct} style={cssProperties}>
            <div className = {style.Header}>
                <p className = {style.NumberLabel}> # </p>
                <p className = {style.OptionLabel}> Option </p>
                { surveyInfo.isEvaluated && <p className = {style.ScoreLabel}> Score </p> }
            </div>
            { renderOptions(question.options) }
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

export default React.memo(ChoiceQuestionConstruct);