import React, { FC, useMemo } from 'react';
import { IQuestion, QuestionType } from '../../types/survey';
import Matchmaking from '../Matchmaking/Matchmaking';
import MultipleChoice from '../MultipleChoice/MultipleChoice';
import SingleChoice from '../SingleChoice/SingleChoice';
import TextField from '../TextField/TextField';
import style from './Question.module.scss';
import { Typography } from '@mui/material';

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
            <Typography 
                variant={"h6"} 
                component={"h6"} 
                sx = {{ marginBottom: '20px' }} 
                >
                    { topic }
            </Typography>
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