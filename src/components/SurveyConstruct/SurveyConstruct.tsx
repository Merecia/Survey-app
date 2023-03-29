import React, { FC, useState } from 'react';
import { IOption } from '../../types/survey';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import Textarea from '../../UI/Textarea/Textarea';
import style from './SurveyConstruct.module.scss';

const SurveyConstruct: FC = () => {
    const initialOptions = [
        { id: 1, label: '', score: 0 },
        { id: 2, label: '', score: 0 }
    ];

    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState<IOption[]>(initialOptions);

    const questionChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setQuestion(event.target.value);
    }

    const renderOptions = () => {
        return options.map(option => renderOption(option));
    }

    const optionChangeHandler = (
        option: IOption,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedOptions = options.map(item => {
            if (item.id === option.id) {
                return {
                    id: item.id,
                    label: event.target.value,
                    score: item.score
                }
            } else return item;
        })

        setOptions(updatedOptions);
    }

    const scoreInputChangeHandler = (
        option: IOption,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedOptions = options.map(item => {
            if (item.id === option.id) {
                return {
                    id: item.id,
                    label: item.label,
                    score: Number(event.target.value)
                }
            } else return item;
        })

        setOptions(updatedOptions);
    }

    const renderOption = (option: IOption) => {
        return (
            <div className={style.Option}>
                <span> {option.id} </span>
                <Input
                    value={option.label || ''}
                    onChangeHandler={
                        (event: React.ChangeEvent<HTMLInputElement>) =>
                            optionChangeHandler(option, event)
                    }
                />
                <Input
                    value={String(option.score) || '0'}
                    onChangeHandler={
                        (event: React.ChangeEvent<HTMLInputElement>) =>
                            scoreInputChangeHandler(option, event)
                    }
                    type='number'
                />
                <Button 
                    label = 'Удалить'
                    clickHandler = {() => deleteButtonClickHandler(option)}
                />
            </div>
        );
    }

    const deleteButtonClickHandler = (option: IOption) => {
        let updatedOptions = options
            .filter(item => item.id !== option.id)
            .map((item, index) => {
                return {
                    id: index + 1,
                    label: item.label,
                    score: item.score
                }
            })

        setOptions(updatedOptions);
    }

    const buttonClickHandler = () => {
        const lastId = options.length;

        const updatedOptions = [...options];

        updatedOptions.push({
            id: lastId + 1,
            label: '',
            score: 0
        });

        setOptions(updatedOptions);
    }

    return (
        <div className={style.SurveyConstruct}>
            <div className={style.SingleChoiceConstruct}>
                <p> Текст вопроса: </p>
                <Textarea
                    value={question}
                    onChangeHandler={questionChangeHandler}
                />
                <div>
                    <div>
                        <span> Варианты ответов </span>
                    </div>
                    {renderOptions()}
                    <Button
                        label={"Добавить новый вариант ответа"}
                        clickHandler={buttonClickHandler}
                    />
                </div>
            </div>
        </div>
    );
}

export default SurveyConstruct;

