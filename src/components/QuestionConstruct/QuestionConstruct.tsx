import React, { FC } from 'react';
import { IQuestion } from '../../types/survey';
import Input from '../../UI/Input/Input';
import style from './QuestionConstruct.module.scss';
import Select from '../../UI/Select/Select';
import { QuestionType } from '../../types/survey';
import Checkbox from '../../UI/Checkbox/Checkbox';
import ChoiceQuestionConstruct from './ChoiceQuestionConstruct/ChoiceQuestionConstruct';
import Button from '../../UI/Button/Button';
import TextQuestionConstruct from './TextQuestionConstruct/TextQuestionConstruct';
import MatchmakingQuestionConstruct from './MatchmakingQuestionConstruct/MatchmakingQuestionConstruct';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
// import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
// import DeleteIcon from '@material-ui/icons/Delete';

interface IQuestionConstructProps {
    question: IQuestion;
    cssProperties?: React.CSSProperties;
}

const QuestionConstruct: FC<IQuestionConstructProps> = ({ 
    question, 
    cssProperties 
}) => {
    const questionTypes = {
        "Single Choice Question": QuestionType.OneChoice,
        "Multiple Choice Question": QuestionType.MultipleChoice,
        "Short Answer Question": QuestionType.ShortTextField,
        "Detailed Answer Question": QuestionType.DetailedTextField,
        "Matchmaking Question": QuestionType.Matchmaking
    };
    const initialQuestionType: string = "Single Choice Question";

    const getNameOfType = (questionType: QuestionType) => {
        return Object.keys(questionTypes).find(
            (typeName) => questionTypes[typeName as keyof typeof questionTypes] === questionType
        );
    }

    const { questions } = useTypedSelector(state => state.survey);
    const { updateQuestion, updateQuestions, updateQuestionType } = useActions();

    const questionChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        question.topic = event.target.value;
        updateQuestion(question);
    }

    const questionTypeChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const typeName = questionTypes.hasOwnProperty(event.target.value)
            ? event.target.value
            : initialQuestionType;

        const type = questionTypes[typeName as keyof typeof questionTypes];

        updateQuestionType(question, type);
    }

    const requiredChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        question.required = event.target.checked;
        updateQuestion(question);
    }

    const renderAnswerFields = () => {
        if (
            question.type === QuestionType.OneChoice ||
            question.type === QuestionType.MultipleChoice
        ) {
            return (
                <ChoiceQuestionConstruct
                    key={question.id}
                    question={question}
                />
            );
        } else if (
            question.type === QuestionType.ShortTextField ||
            question.type === QuestionType.DetailedTextField
        ) {
            return (
                <TextQuestionConstruct
                    key={question.id}
                    question={question}
                />
            );
        } else if (question.type === QuestionType.Matchmaking) {
            return (
                <MatchmakingQuestionConstruct
                    key={question.id}
                    question={question}
                />
            );
        }
    }

    const deleteQuestionButtonClickHandler = () => {
        const updatedQuestions: IQuestion[] = questions
            .filter(item => item.id !== question.id)
            .map((item, index) => {
                if (
                    item.type === QuestionType.OneChoice || 
                    item.type === QuestionType.MultipleChoice ||
                    item.type === QuestionType.Matchmaking
                ) {
                    return {
                        id: index + 1,
                        topic: item.topic,
                        type: item.type,
                        required: item.required,
                        options: item.options  
                    }
                } else {
                    return {
                        id: index + 1,
                        topic: item.topic,
                        type: item.type,
                        required: item.required,
                        correctAnswer: item.correctAnswer
                    }
                }
                
            });

        updateQuestions(updatedQuestions);
    }

    return (
        <div className={style.QuestionConstruct} style={cssProperties}>
            <div className={style.Header}>
                <Input
                    placeholder={"Enter an question"}
                    value={question.topic}
                    onChangeHandler={questionChangeHandler}
                    cssProperties={{width: '50%'}}
                />
                <Select
                    id={question.id}
                    value={getNameOfType(question.type) || initialQuestionType}
                    options={Object.keys(questionTypes)}
                    onChangeHandler={questionTypeChangeHandler}
                />
            </div>
            <div className={style.AnswersField}>
                {renderAnswerFields()}
            </div>
            <div className={style.Footer}>
                <Checkbox
                    label={"Required"}
                    checked={question.required}
                    onChangeHandler={requiredChangeHandler}
                />
                <Button
                    label={"Delete the question"}
                    clickHandler={deleteQuestionButtonClickHandler}
                />
            </div>
        </div>
    );
}

export default QuestionConstruct;