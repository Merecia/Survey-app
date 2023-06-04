import React, { FC, useMemo } from 'react';
import { IQuestion } from '../../types/survey';
import style from './QuestionConstruct.module.scss';
import { QuestionType } from '../../types/survey';
import ChoiceQuestionConstruct from './ChoiceQuestionConstruct/ChoiceQuestionConstruct';
import TextQuestionConstruct from './TextQuestionConstruct/TextQuestionConstruct';
import MatchmakingQuestionConstruct from './MatchmakingQuestionConstruct/MatchmakingQuestionConstruct';
import { useActions } from '../../hooks/useActions';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { FormControlLabel, MenuItem, TextField, Checkbox, Button } from '@mui/material';

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

    const { surveyInfo } = useTypedSelector(state => state.survey);

    const questionTypeChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const typeName = questionTypes.hasOwnProperty(event.target.value)
            ? event.target.value
            : initialQuestionType;

        const type = questionTypes[typeName as keyof typeof questionTypes];

        updateQuestionType(question, type, surveyInfo.isEvaluated);
    }

    const renderAnswerFields = (question: IQuestion) => {
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
            if (surveyInfo.isEvaluated) {
                return (
                    <TextQuestionConstruct
                        key={question.id}
                        question={question}
                    />
                );
            }
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
        return Object.keys(questionTypes).map((typeName, index) => {
            return <MenuItem value={typeName} key={index}> {typeName} </MenuItem>
        });
    }

    const renderHeader = (topic: string, type: QuestionType) => {
        return (
            <div className={style.Header}>
                <TextField
                    label="Enter an question"
                    size='small'
                    sx={{ width: '50%' }}
                    value={topic}
                    onChange={(event) => updateQuestionTopic(question, event.target.value)}
                />
                <TextField
                    label='Choose question type'
                    size='small'
                    value={getNameOfType(type) || initialQuestionType}
                    onChange={questionTypeChangeHandler}
                    select
                >
                    {renderQuestionTypes()}
                </TextField>
            </div>
        );
    }

    const renderFooter = (required: boolean) => {
        return (
            <div className={style.Footer}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={required}
                            onChange={(event) => updateQuestionRequired(question, event.target.checked)}
                        />
                    }
                    label="Is required?"
                />
                <Button
                    variant='outlined'
                    onClick={() => deleteQuestion(question)}
                    startIcon={<DeleteIcon />}
                >
                    Delete Question
                </Button>
            </div>
        );
    }

    return (
        <div className={style.QuestionConstruct} style={cssProperties}>
            { 
                useMemo(
                    () => renderHeader(question.topic, question.type), 
                    [question.topic, question.type]
                ) 
            }
            <div className={style.AnswersField}>
            { 
                renderAnswerFields(question)
                // useMemo(
                //     () => renderAnswerFields(question),
                //     [question] 
                // )
            }
            </div>
            {
                useMemo(
                    () => renderFooter(question.required),
                    [question.required]
                )
            }
        </div>
    );
}

export default QuestionConstruct;