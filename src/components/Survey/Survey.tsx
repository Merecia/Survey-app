import { FC, useEffect } from 'react';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { IQuestion, ISurvey, ISurveyResults } from '../../types/survey';
import Question from '../Question/Question';
import style from './Survey.module.scss';
import { Button, Typography } from '@mui/material';

interface ISurveyProps {
    survey: ISurvey;
}

const Survey: FC<ISurveyProps> = ({ survey }) => {
    const { finishSurvey, updateQuestions } = useActions();
    const { answersToQuestions, questions } = useTypedSelector(state => state.survey);

    useEffect(() => {
        updateQuestions(survey.questions);
        // eslint-disable-next-line
    }, [])

    const renderQuestions = () => {
        return (
            <ul className={style.Questions}>
                { survey.questions.map(question => renderQuestion(question)) }
            </ul>
        );
    }

    const renderQuestion = (question: IQuestion) => {
        return (
            <li className={style.Question} key={question.id}>
                <Question
                    question={question}
                    cssProperties={{ 
                        margin: '20px 0px', 
                        width: '80%' 
                    }}
                />
            </li>
        );
    }

    const areAllRequiredQuestionsAnswered = (): boolean => {
        const requiredQuestionsId: number[] = [];

        questions.forEach(question => {
            if (question.required) {
                requiredQuestionsId.push(question.id);
            }
        })

        const answeredQuestionsId: number[] = answersToQuestions.map(
            answerToQuestion => answerToQuestion.question.id
        );

        let allRequiredQuestionsAreAnswered = true;

        requiredQuestionsId.forEach(requiredQuestionId => {
            if (!answeredQuestionsId.includes(requiredQuestionId)) {
                allRequiredQuestionsAreAnswered = false;
            }
        })

        return allRequiredQuestionsAreAnswered;
    }

    const finishButtonClickHandler = () => {
        if (areAllRequiredQuestionsAnswered()) {
            alert('You have finished passing the survey');

            const allSurveyResultsData = localStorage.getItem('allSurveyResults');
            let allSurveyResults, id;

            if (allSurveyResultsData) {
                allSurveyResults = JSON.parse(allSurveyResultsData);
                const lastSurvey = allSurveyResults[allSurveyResults.length - 1];
                id = lastSurvey.id + 1;
            } else {
                allSurveyResults = [];
                id = 1;
            }

            const surveyResults: ISurveyResults = {
                id,
                surveyInfo: survey.surveyInfo,
                passingTimeSeconds: 100,
                answersToQuestions: answersToQuestions
            };

            allSurveyResults.push(surveyResults);
            localStorage.setItem('allSurveyResults', JSON.stringify(allSurveyResults));
        } else {
            console.log('You need to answer all required questions');
        }
    }

    console.log(questions);
    console.log(answersToQuestions);

    return (
        <div className={style.Survey}>
            <div className={style.Wrapper}>
                <div className={style.Header}>
                    <div className={style.SurveyDetails} style = {{ width: '80%' }}>
                        <Typography
                            variant={"h4"}
                            component={"h4"}
                            sx={{
                                textAlign: 'center',
                                margin: '10px auto'
                            }}
                        >
                            {survey.surveyInfo.title}
                        </Typography>
                        <hr />
                        <p className={style.Description}> {survey.surveyInfo.description} </p>
                    </div>
                    <img
                        className={style.SurveyImage}
                        src={survey.surveyInfo.imageUrl}
                        alt={"SurveyImage"}
                        style = {{ width: '80%' }}
                    />
                </div>
                {renderQuestions()}
                <Button
                    variant='contained'
                    onClick={finishButtonClickHandler}
                    sx={{
                        padding: '15px',
                        width: '80%',
                        display: 'flex',
                        justifyContent: 'center',
                        margin: '20px auto'
                    }}
                >
                    Finish the survey
                </Button>
            </div>
        </div>
    );
}

export default Survey;