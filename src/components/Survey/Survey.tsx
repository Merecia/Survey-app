import { FC } from 'react';
import { survey } from '../../data/data';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import Button from '../../UI/Button/Button';
import Question from '../Question/Question';
import style from './Survey.module.scss';

const Survey: FC = () => {

    const renderQuestions = () => {
        return survey.questions.map(question =>
            <Question 
                key = {question.id}
                question = {question}
                margin = '20px'
            />
        )
    }

    const answersQuestions = useTypedSelector(state => state.survey.answersQuestions);

    const saveResults = () => {
        console.log(`ID опроса: ${survey.id}`);
        console.log(`Заголовок опроса: ${survey.title}`);
        console.log('Ответы на вопросы:' );
        console.log(answersQuestions);
    }

    return (
        <div className={style.Survey}>
            <div className={style.Wrapper}>
                <h1 style = {{textAlign: 'center'}}> {survey.title} </h1>
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