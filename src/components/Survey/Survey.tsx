import { FC } from 'react';
import { test } from '../../data/data';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import Button from '../../UI/Button/Button';
import Question from '../Question/Question';
import style from './Survey.module.scss';

const Survey: FC = () => {

    const {scoreTest} = useActions();

    const renderQuestions = () => {
        return test.questions.map(question =>
            <Question 
                key = {question.id}
                question = {question}
                margin = '20px'
            />
        )
    }

    const answersQuestions = useTypedSelector(state => state.survey.answersQuestions);

    const saveResults = () => {
        console.log(`ID опроса: ${test.id}`);
        console.log(`Заголовок опроса: ${test.title}`);
        console.log('Ответы на вопросы:' );
        console.log(answersQuestions);
        scoreTest();
    }

    return (
        <div className={style.Survey}>
            <div className={style.Wrapper}>
                <h1 style = {{textAlign: 'center'}}> {test.title} </h1>
                {renderQuestions()}
                <Button 
                    label = 'Save Results'
                    clickHandler = {saveResults}
                    margin = '2% 30%'
                    width = '40%'
                />
            </div>
        </div>
    );
}

export default Survey;