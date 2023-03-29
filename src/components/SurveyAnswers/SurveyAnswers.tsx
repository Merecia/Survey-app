import { FC, useEffect } from 'react';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { IAnswerToQuestion } from '../../types/survey';
import Answer from '../Answer/Answer';
import style from './SurveyAnswers.module.scss';

interface ISurveyAnswersProps {
    id: number;
    title: string;
}

const SurveyAnswers: FC<ISurveyAnswersProps> = ({ id, title }) => {
    const { answersToQuestions } = useTypedSelector(state => state.survey);
    const { loadAnswersToQuestions } = useActions();

    useEffect(() => {
        loadAnswersToQuestions(id);
        // eslint-disable-next-line
    }, [])

    const renderAnswersToQuestions = () => {
        return (
            <ul className = {style.AnswersToQuestions}>
                { answersToQuestions.map(answer => renderAnswerToQuestion(answer)) }
            </ul>
        );
    }

    const renderAnswerToQuestion = (answerToQuestion: IAnswerToQuestion) => {
        return (
            <li 
                className = {style.AnswerToQuestion} 
                key = {answerToQuestion.question.id}
            >
                <Answer 
                    answerToQuestion={answerToQuestion}
                    cssProperties={{ margin: '20px' }}
                />
            </li>
        );
    }

    return (
        <div className={style.SurveyAnswers}>
            <div className={style.Wrapper}>
                <h1 style={{ textAlign: 'center' }}> {title} </h1>
                {renderAnswersToQuestions()}
            </div>
        </div>
    );
}

export default SurveyAnswers;