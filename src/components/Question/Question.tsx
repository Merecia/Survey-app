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
                        options={question.options}
                        topic={question.topic}
                    />
                }

                else if (question.type === QuestionType.MultipleChoice) {
                    return <MultipleChoice
                        id={question.id}
                        options={question.options}
                        topic={question.topic}
                    />
                }

            } else if (isMatches(question.options) &&
                question.type === QuestionType.Matchmaking) {
                return <Matchmaking
                    id={question.id}
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
                    correctAnswer={question.correctAnswer}
                    topic={question.topic}
                />

                return <TextField
                    id={question.id}
                    type={TextFieldType.Short}
                    topic={question.topic}
                />

            } else if (question.type === QuestionType.DetailedTextField) {

                return <TextField
                    id={question.id}
                    type={TextFieldType.Detailed}
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