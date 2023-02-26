import { FC, useEffect } from 'react';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import Button from '../../UI/Button/Button';
import Question from '../Question/Question';
import style from './Survey.module.scss';

interface ISurveyProps {
    title: string;
}

const Survey: FC<ISurveyProps> = ({ title }) => {
    const {
        finishTest,
        loadQuestions
    } = useActions();
    const { answersToQuestions, questions } = useTypedSelector(state => state.survey);

    useEffect(() => {
        loadQuestions();
    }, [])

    const renderQuestions = () => {
        return questions.map(question =>
            <Question
                key={question.id}
                question={question}
                margin='20px'
            />
        );
    }

    /*
        This function should be in Redux, because components must contain only
        simple logic for rendering, styling etc., but this logic is hard and
        it is not related to component logic. This is logic of the passing test,
        so it must be in Redux.
    */
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
            finishTest();
        } else {
            console.log('You need to answer all required questions');
        }
    }

    console.log(questions);
    console.log(answersToQuestions);

    return (
        <div className={style.Survey}>
            <div className={style.Wrapper}>
                <h1 style={{ textAlign: 'center' }}> {title} </h1>
                {renderQuestions()}
                <Button
                    label='Save Results'
                    clickHandler={finishButtonClickHandler}
                    width='70%'
                    margin='2% 15%'
                />
            </div>
        </div>
    );
}

export default Survey;