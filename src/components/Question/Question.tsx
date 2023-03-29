import { FC } from 'react';
import { IQuestion, QuestionType } from '../../types/survey';
import Matchmaking from '../Matchmaking/Matchmaking';
import MultipleChoice from '../MultipleChoice/MultipleChoice';
import SingleChoice from '../SingleChoice/SingleChoice';
import TextField from '../TextField/TextField';
import style from './Question.module.scss';

interface IQuestionProps {
    question: IQuestion;
    cssProperties?: React.CSSProperties;
}

const Question: FC<IQuestionProps> = ({ question, cssProperties }) => {

    const renderResponseField = () => {
        if (question.type === QuestionType.Matchmaking) {
            return (
                <Matchmaking
                    question={question}
                />
            );
        }
        else if (question.type === QuestionType.OneChoice) {
            return (
                <SingleChoice
                    question={question}
                />
            );
        }
        else if (question.type === QuestionType.MultipleChoice) {
            return (
                <MultipleChoice
                    question={question}
                />
            );
        }
        else if (question.type === QuestionType.ShortTextField) {
            return (
                <TextField
                    question={question}
                />
            );
        }
        else if (question.type === QuestionType.DetailedTextField) {
            return (
                <TextField
                    question={question}
                />
            );
        }
    }

    return (
        <div className={style.Question} style={cssProperties}>
            <p> {question.topic} </p>
            {renderResponseField()}
        </div>
    );
}

export default Question;