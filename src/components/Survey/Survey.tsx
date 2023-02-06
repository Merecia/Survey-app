import { FC } from 'react';
import { test } from '../../data/data';
import { useActions } from '../../hooks/useActions';
import Button from '../../UI/Button/Button';
import Matchmaking from '../Matchmaking/Matchmaking';
import Question from '../Question/Question';
import style from './Survey.module.scss';

const Survey: FC = () => {

    const {finishTest} = useActions();

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
                    margin = '2% 30%'
                    width = '40%'
                />
            </div>
        </div>
    );
}

export default Survey;