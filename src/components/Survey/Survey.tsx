import { FC } from 'react';
import { QuestionType } from '../../types/survey';
import Question from '../Question/Question';
import style from './Survey.module.scss';

const Survey: FC = () => {

    const answers1 = [
        { id: 1, label: 'Первый ответ' },
        { id: 2, label: 'Второй ответ' },
        { id: 3, label: 'Третий ответ' },
        { id: 4, label: 'Четвертый ответ' }
    ];

    const answers2 = [
        { id: 1, label: 'Первый ответ' },
        { id: 2, label: 'Второй ответ' },
        { id: 3, label: 'Третий ответ' }
    ];

    const question = 'Здесь будет вопрос';

    return (
        <div className={style.Survey}>
            <div className={style.Wrapper}>
                <Question
                    answers={answers1}
                    question={question}
                    type={QuestionType.MultipleChoice}
                    margin='20px'
                />
                <Question
                    answers={answers2}
                    question={question}
                    type={QuestionType.OneChoice}
                    margin='20px'
                />
                <Question
                    question={question}
                    type={QuestionType.ShortTextField}
                    margin='20px'
                />
                <Question
                    question={question}
                    type={QuestionType.DetailedTextField}
                    margin='20px'
                />
            </div>
        </div>
    );
}

export default Survey;