import { FC } from 'react';
import { Answer, QuestionType, TextFieldType } from '../../types/survey';
import MultipleChoice from '../MultipleChoice/MultipleChoice';
import SingleChoice from '../SingleChoice/SingleChoice';
import TextField from '../TextField/TextField';
import style from './Question.module.scss';

interface QuestionProps {
    answers?: Answer[],
    question: string;
    type: QuestionType;
    margin: string;
}

const Question: FC<QuestionProps> = ({ answers, question, type, margin }) => {

    const renderResponseField = () => {

        if (type === QuestionType.OneChoice && answers) {
            return <SingleChoice
                answers={answers}
            />
        }

        else if (type === QuestionType.MultipleChoice && answers) {
            return <MultipleChoice
                answers={answers}
            />
        }

        else if (type === QuestionType.ShortTextField) {
            return <TextField
                type = {TextFieldType.Short}
            />
        }

        else if (type === QuestionType.DetailedTextField) {
            return <TextField 
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