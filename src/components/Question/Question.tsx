import { FC } from 'react';
import { correctAnswer } from '../../data/data';
import { isMatches } from '../../helper';
import { IQuestion, QuestionType, TextFieldType } from '../../types/survey';
import Matchmaking from '../Matchmaking/Matchmaking';
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

        if (question.options) {

            if (!isMatches(question.options)) {

                if (question.type === QuestionType.OneChoice) {
                    return <SingleChoice
                        id={question.id}
                        required={question.required}
                        topic={question.topic}
                        options={question.options}
                    />
                }

                else if (question.type === QuestionType.MultipleChoice) {
                    return <MultipleChoice
                        id={question.id}
                        required={question.required}
                        topic={question.topic}
                        options={question.options}
                    />
                }

            } else if (isMatches(question.options)
                && question.type === QuestionType.Matchmaking) {
                return <Matchmaking
                    id={question.id}
                    required={question.required}
                    topic={question.topic}
                    leftList={question.options.leftList}
                    rightList={question.options.rightList}
                />
            }

        } else {

            if (question.type === QuestionType.ShortTextField) {

                if (correctAnswer) return <TextField
                    id={question.id}
                    type={TextFieldType.Short}
                    required={question.required}
                    correctAnswer={question.correctAnswer}
                    topic={question.topic}
                />

                return <TextField
                    id={question.id}
                    type={TextFieldType.Short}
                    required={question.required}
                    topic={question.topic}
                />

            } else if (question.type === QuestionType.DetailedTextField) {

                return <TextField
                    id={question.id}
                    type={TextFieldType.Detailed}
                    required={question.required}
                    topic={question.topic}
                />
            }
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