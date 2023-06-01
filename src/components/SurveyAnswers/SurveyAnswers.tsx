import { FC, useEffect } from 'react';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { IAnswerToQuestion, ISurveyResults } from '../../types/survey';
import Answer from '../Answer/Answer';
import style from './SurveyAnswers.module.scss';
import { Typography } from '@mui/material';

interface ISurveyAnswersProps {
    //id: number;
    //title: string;
    surveyResults: ISurveyResults;
}

const SurveyAnswers: FC<ISurveyAnswersProps> = ({ surveyResults }) => {
    const { answersToQuestions } = useTypedSelector(state => state.survey);
    const { loadAnswersToQuestions } = useActions();

    useEffect(() => {
        // loadAnswersToQuestions(id);
        // eslint-disable-next-line
    }, [])

    const renderAnswersToQuestions = () => {
        return (
            <ul className = {style.AnswersToQuestions}>
                { surveyResults.answersToQuestions.map(answer => renderAnswerToQuestion(answer)) }
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
                    cssProperties={{ 
                        margin: '20px 0px',
                        width: '80%'  
                    }}
                />
            </li>
        );
    }

    return (
        <div className={style.SurveyAnswers}>
            <div className={style.Wrapper}>
                <div className={style.Header}>
                    <div className={style.SurveyDetails}>
                        <Typography
                            variant={"h4"}
                            component={"h4"}
                            sx={{
                                textAlign: 'center',
                                margin: '10px auto'
                            }}
                        >
                            {surveyResults.surveyInfo.title}
                        </Typography>
                        <hr />
                        <p className={style.Description}> 
                            {surveyResults.surveyInfo.description} 
                        </p>
                    </div>
                    <img
                        className={style.SurveyImage}
                        src={surveyResults.surveyInfo.imageUrl}
                        alt={"SurveyImage"}
                    />
                </div>
                {renderAnswersToQuestions()}
            </div>
        </div>
    );
}

export default SurveyAnswers;