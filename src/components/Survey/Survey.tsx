import { FC } from 'react';
import { test } from '../../data/data';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import Button from '../../UI/Button/Button';
import Question from '../Question/Question';
import style from './Survey.module.scss';

const Survey: FC = () => {

    const {finishTest} = useActions();
    const {answersToQuestions} = useTypedSelector(state => state.survey);

    console.log(answersToQuestions);

    const renderQuestions = () => {
        return test.questions.map(question =>
            <Question 
                key = {question.id}
                question = {question}
                margin = '20px'
            />
        )
    }

    return (
        <div className={style.Survey}>
            <div className={style.Wrapper}>
                <h1 style = {{textAlign: 'center'}}> {test.title} </h1>
                {renderQuestions()}
                <Button 
                    label = 'Save Results'
                    clickHandler = {finishTest}
                    width = '70%'
                    margin = '2% 15%'
                />
            </div>
        </div>
    );
}

export default Survey;