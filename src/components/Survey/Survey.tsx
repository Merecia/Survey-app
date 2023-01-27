import { FC } from 'react';
import { answer, options1, options2, question } from '../../data/data';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { QuestionType } from '../../types/survey';
import Question from '../Question/Question';
import style from './Survey.module.scss';

const Survey: FC = () => {

    const {answers} = useTypedSelector(state => state.survey);
    const {updateAnswers} = useActions();

    console.log(answers);

    return (
        <div className={style.Survey}>
            <div className={style.Wrapper}>
                <Question
                    id = {1}
                    options={options1}
                    question={question.topic}
                    type={QuestionType.MultipleChoice}
                    margin='20px'
                />
                <Question
                    id = {2}
                    options={options2}
                    question={question.topic}
                    type={QuestionType.OneChoice}
                    margin='20px'
                />
                <Question
                    id = {3}
                    question={question.topic}
                    type={QuestionType.ShortTextField}
                    margin='20px'
                />
                <Question
                    id = {4}
                    question={question.topic}
                    type={QuestionType.DetailedTextField}
                    margin='20px'
                />
                <button onClick = {() => updateAnswers([answer])}> Нажми на меня </button>
            </div>
        </div>
    );
}

export default Survey;