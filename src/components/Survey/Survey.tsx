import { FC, useEffect } from 'react';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import Button from '../../UI/Button/Button';
import Question from '../Question/Question';
import style from './Survey.module.scss';

interface ISurveyProps {
    id: number;
    title: string;
}

const Survey: FC<ISurveyProps> = ({ id, title }) => {
    const {
        finishSurvey,
        loadQuestions
    } = useActions();
    
    const { 
        answersToQuestions, 
        questions 
    } = useTypedSelector(state => state.survey);

    useEffect(() => {
        loadQuestions(id);
        // eslint-disable-next-line
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
            finishSurvey(id);
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