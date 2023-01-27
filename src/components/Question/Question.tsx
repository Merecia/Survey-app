import { FC } from 'react';
import { IOption, QuestionType, TextFieldType } from '../../types/survey';
import MultipleChoice from '../MultipleChoice/MultipleChoice';
import SingleChoice from '../SingleChoice/SingleChoice';
import TextField from '../TextField/TextField';
import style from './Question.module.scss';

interface QuestionProps {
    id: number;
    options?: IOption[],
    question: string;
    type: QuestionType;
    margin: string;
}

const Question: FC<QuestionProps> = ({ id, options, question, type, margin }) => {

    const renderResponseField = () => {

        if (type === QuestionType.OneChoice && options) {
            return <SingleChoice
                id = {id}
                options={options}
            />
        }

        else if (type === QuestionType.MultipleChoice && options) {
            return <MultipleChoice
                id = {id}
                options={options}
            />
        }

        else if (type === QuestionType.ShortTextField) {
            return <TextField
                id = {id}
                type = {TextFieldType.Short}
            />
        }

        else if (type === QuestionType.DetailedTextField) {
            return <TextField 
                id = {id}
                type = {TextFieldType.Detailed}
            />
        }
    }

    return (
        <div className={style.Question} style={{ margin }}>
            <p> {question} </p>
            {renderResponseField()}
        </div>
    );
}

export default Question;