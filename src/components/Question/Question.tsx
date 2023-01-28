import { FC } from 'react';
import { IQuestion, QuestionType, TextFieldType } from '../../types/survey';
import MultipleChoice from '../MultipleChoice/MultipleChoice';
import SingleChoice from '../SingleChoice/SingleChoice';
import TextField from '../TextField/TextField';
import style from './Question.module.scss';

interface QuestionProps {
    question: IQuestion;
    margin: string;
}

const Question: FC<QuestionProps> = ({ question, margin }) => {

    const renderResponseField = () => {

        if (question.type === QuestionType.OneChoice && question.options) {
            return <SingleChoice
                id = {question.id}
                options = {question.options}
                topic = {question.topic}
            />
        }

        else if (question.type === QuestionType.MultipleChoice && question.options) {
            return <MultipleChoice
                id = {question.id}
                options = {question.options}
                topic = {question.topic}
            />
        }

        else if (question.type === QuestionType.ShortTextField) {
            return <TextField
                id = {question.id}
                type = {TextFieldType.Short}
                topic = {question.topic}
            />
        }

        else if (question.type === QuestionType.DetailedTextField) {
            return <TextField
                id = {question.id} 
                type = {TextFieldType.Detailed}
                topic = {question.topic}
            />
        }
    }

    return (
        <div className={style.Question} style={{ margin }}>
            <p> {question.topic} </p>
            {renderResponseField()}
        </div>
    );
}

export default Question;