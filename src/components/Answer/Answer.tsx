import { FC } from 'react';
import { isMatches, isTextAnswer, isOption, isSetOfOptions, getFeedback } from '../../helper';
import { IAnswer, IAnswerToQuestion } from '../../types/survey';
import { IQuestion, QuestionType } from '../../types/survey';
import style from './Answer.module.scss';
import Matchmaking from '../Matchmaking/Matchmaking';
import MultipleChoice from '../MultipleChoice/MultipleChoice';
import SingleChoice from '../SingleChoice/SingleChoice';
import TextField from '../TextField/TextField';
import Feedback from '../Feedback/Feedback';

interface IAnswerProps {
    answerToQuestion: IAnswerToQuestion;
    isEvaluated: boolean;
    cssProperties?: React.CSSProperties;
}

const Answer: FC<IAnswerProps> = ({ 
    answerToQuestion, 
    isEvaluated, 
    cssProperties 
}) => {
    const renderResponseField = (question: IQuestion, answer: IAnswer) => {
        if (question.type === QuestionType.Matchmaking) {
            return (
                <Matchmaking
                    question={question}
                    selectedMatches={isMatches(answer) ? answer : undefined}
                />
            );
        }
        else if (question.type === QuestionType.OneChoice) {
            return (
                <SingleChoice
                    question={question}
                    selectedOption={isOption(answer) ? answer : undefined}
                />
            );
        }
        else if (question.type === QuestionType.MultipleChoice) {
            return (
                <MultipleChoice
                    question={question}
                    selectedOptions={isSetOfOptions(answer) ? answer : undefined}
                />
            );
        }
        else if (
            question.type === QuestionType.ShortTextField ||
            question.type === QuestionType.DetailedTextField
        ) {
            return (
                <TextField
                    question={question}
                    givedAnswer={isTextAnswer(answer) ? answer : undefined}
                />
            );
        }
    }

    const renderTopic = (topic: string) => <p className = {style.Topic}> {topic} </p>

    const feedback = isEvaluated ? getFeedback(answerToQuestion) : undefined;

    return (
        <div className={style.Answer} style={cssProperties}>
            { renderTopic(answerToQuestion.question.topic) }
            { renderResponseField(answerToQuestion.question, answerToQuestion.answer) }
            { feedback && <Feedback feedback={feedback} /> }
        </div>
    );
}

export default Answer;