import { FC } from 'react';
import './App.css';
import Question from './components/Question/Question';
import { QuestionType } from './types/survey';

const App: FC = () => {

  const answers = [
    { id: 1, label: 'Первый ответ' },
    { id: 2, label: 'Второй ответ' },
    { id: 3, label: 'Третий ответ' },
    { id: 4, label: 'Четвертый ответ' }
  ];

  const question = 'Здесь будет вопрос';

  return (
    <>
      <Question
        answers={answers}
        question={question}
        type={QuestionType.MultipleChoice}
      />

      <Question
        answers={answers}
        question={question}
        type={QuestionType.OneChoice}
      />
    </>
  );
}

export default App;
