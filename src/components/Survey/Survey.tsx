import { FC, useEffect } from 'react';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { IQuestion, ISurvey } from '../../types/survey';
import Button from '../../UI/Button/Button';
import Question from '../Question/Question';
import style from './Survey.module.scss';

interface ISurveyProps {
    survey: ISurvey;
}

const Survey: FC<ISurveyProps> = ({ survey }) => {
    const {
        finishSurvey,
        updateQuestions
    } = useActions();

    const {
        answersToQuestions,
        questions
    } = useTypedSelector(state => state.survey);

    useEffect(() => {
        updateQuestions(survey.questions);
        // eslint-disable-next-line
    }, [])

    const renderQuestions = () => {
        return (
            <ul className={style.Questions}>
                {survey.questions.map(question => renderQuestion(question))}
            </ul>
        );
    }

    const renderQuestion = (question: IQuestion) => {
        return (
            <li className={style.Question} key = {question.id}>
                <Question
                    question={question}
                    cssProperties={{ margin: '20px' }}
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
            finishSurvey(survey.surveyInfo.id);
        } else {
            console.log('You need to answer all required questions');
        }
    }

    console.log(questions);
    console.log(answersToQuestions);

    return (
        <div className={style.Survey}>
            <div className={style.Wrapper}>
                <h1 style={{ textAlign: 'center' }}> {survey.surveyInfo.title} </h1>
                {renderQuestions()}
                <Button
                    label='Save Results'
                    clickHandler={finishButtonClickHandler}
                    cssProperties={{
                        width: '70%',
                        margin: '2% 15%'
                    }}
                />
            </div>
        </div>
    );
}

export default Survey;