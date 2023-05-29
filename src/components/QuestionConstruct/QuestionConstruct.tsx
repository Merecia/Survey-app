import React, { FC } from 'react';
import { IQuestion } from '../../types/survey';
import style from './QuestionConstruct.module.scss';
import { QuestionType } from '../../types/survey';
import ChoiceQuestionConstruct from './ChoiceQuestionConstruct/ChoiceQuestionConstruct';
import TextQuestionConstruct from './TextQuestionConstruct/TextQuestionConstruct';
import MatchmakingQuestionConstruct from './MatchmakingQuestionConstruct/MatchmakingQuestionConstruct';
import { useActions } from '../../hooks/useActions';
import { FormControlLabel, MenuItem, TextField, Checkbox, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

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

    const { 
        updateQuestionType,
        updateQuestionTopic,
        updateQuestionRequired,
        deleteQuestion
    } = useActions();

    const questionTypeChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const typeName = questionTypes.hasOwnProperty(event.target.value)
            ? event.target.value
            : initialQuestionType;

        const type = questionTypes[typeName as keyof typeof questionTypes];

        updateQuestionType(question, type);
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

    const renderQuestionTypes = () => {
        return Object.keys(questionTypes).map(typeName => {
            return <MenuItem value = {typeName}> {typeName} </MenuItem>
        });
    }

    return (
        <div className={style.QuestionConstruct} style={cssProperties}>
            <div className={style.Header}>
                <TextField 
                    label = "Enter an question"
                    size = 'small'
                    sx = {{ width: '50%' }}
                    value={question.topic}
                    onChange={(event) => updateQuestionTopic(question, event.target.value)}
                />
                <TextField
                    label = 'Choose question type'
                    size = 'small'
                    value={getNameOfType(question.type) || initialQuestionType}
                    onChange = {questionTypeChangeHandler}
                    select
                >
                    { renderQuestionTypes() }
                </TextField>
            </div>
            <div className={style.AnswersField}>
                {renderAnswerFields()}
            </div>
            <div className={style.Footer}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={question.required}
                            onChange = {(event) => updateQuestionRequired(question, event.target.checked)}
                        />
                    }
                    label="Is required?"
                />
                <Button 
                    variant = 'outlined' 
                    onClick = {() => deleteQuestion(question)}
                    startIcon={<DeleteIcon />}
                > 
                    Delete Question
                </Button>
            </div>
        </div>
    );
}

export default QuestionConstruct;