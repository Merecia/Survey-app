import React, { FC, useMemo } from 'react';
import { IQuestion, QuestionType } from '../../types/survey';
import Matchmaking from '../Matchmaking/Matchmaking';
import MultipleChoice from '../MultipleChoice/MultipleChoice';
import SingleChoice from '../SingleChoice/SingleChoice';
import TextField from '../TextField/TextField';
import style from './Question.module.scss';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

interface IQuestionProps {
    question: IQuestion;
    cssProperties?: React.CSSProperties;
}

const Question: FC<IQuestionProps> = ({ question, cssProperties }) => {

    const renderResponseField = () => {
        if (question.type === QuestionType.Matchmaking) {
            return <Matchmaking question={question} />
        }

        else if (question.type === QuestionType.OneChoice) {
            return <SingleChoice question={question} />
        }

        else if (question.type === QuestionType.MultipleChoice) {
            return <MultipleChoice question={question} />
        }

        else if (
            question.type === QuestionType.ShortTextField || 
            question.type === QuestionType.DetailedTextField
        ) {
            return <TextField question={question} />
        }
    }

    const renderTopic = (topic: string) => {
        return (
            <div className = {style.Topic}>
                <p className = {style.QuestionText}> {topic} </p>
                {
                    question.required && 
                    <span className = {style.RequiredLabel}> * </span>
                }
            </div>
        );
    }

    return (
        <div className={style.Question} style={cssProperties}>
            { useMemo(() => renderTopic(question.topic), [question.topic]) }
            { renderResponseField() }
        </div>
    );
}

export default React.memo(Question);