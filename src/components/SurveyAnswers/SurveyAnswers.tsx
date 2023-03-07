import { FC, useEffect } from 'react';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
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

    const renderAnswersToQuestion = () => {
        return answersToQuestions.map(answerToQuestion => (
            <Answer
                key={answerToQuestion.question.id}
                answerToQuestion={answerToQuestion}
                margin='20px'
            />
        ));
    }

    return (
        <div className={style.SurveyAnswers}>
            <div className={style.Wrapper}>
                <h1 style={{ textAlign: 'center' }}> {title} </h1>
                {renderAnswersToQuestion()}
            </div>
        </div>
    );
}

export default SurveyAnswers;