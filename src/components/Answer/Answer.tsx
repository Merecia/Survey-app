import { FC } from 'react';
import { isMatches, isTextAnswer, isOption, isSetOfOptions, makeOptionIdLetter } from '../../helper';
import { IAnswer, IAnswerToQuestion, IFeedback } from '../../types/survey';
import { IQuestion, QuestionType } from '../../types/survey';
import style from './Answer.module.scss';
import Matchmaking from '../Matchmaking/Matchmaking';
import MultipleChoice from '../MultipleChoice/MultipleChoice';
import SingleChoice from '../SingleChoice/SingleChoice';
import TextField from '../TextField/TextField';
import Feedback from '../Feedback/Feedback';
import { Typography } from '@mui/material';

interface IAnswerProps {
    answerToQuestion: IAnswerToQuestion;
    cssProperties?: React.CSSProperties;
}

const Answer: FC<IAnswerProps> = ({ answerToQuestion, cssProperties }) => {
    const renderResponseField = (question: IQuestion, answer: IAnswer) => {
        if (question.type === QuestionType.Matchmaking) {
            return (
                <Matchmaking
                    question={question}
                    selectedMatches={isMatches(answer) ? answer : undefined}
                />
            );
        }
        else if (question.type === QuestionType.OneChoice) {
            return (
                <SingleChoice
                    question={question}
                    selectedOption={isOption(answer) ? answer : undefined}
                />
            );
        }
        else if (question.type === QuestionType.MultipleChoice) {
            return (
                <MultipleChoice
                    question={question}
                    selectedOptions={isSetOfOptions(answer) ? answer : undefined}
                />
            );
        }
        else if (
            question.type === QuestionType.ShortTextField ||
            question.type === QuestionType.DetailedTextField
        ) {
            return (
                <TextField
                    question={question}
                    givedAnswer={isTextAnswer(answer) ? answer : undefined}
                />
            );
        }
    }

    const getMaximumScore = (question: IQuestion): number => {
        let maximumScore: number = 0;

        if (question.options) {
            if (isMatches(question.options)) {
                question.options.leftList.forEach(option => {
                    if (option.score && option.score > 0) {
                        maximumScore += option.score;
                    }
                })
            }

            else if (
                question.type === QuestionType.OneChoice ||
                question.type === QuestionType.MultipleChoice
            ) {
                question.options.forEach(option => {
                    if (option.score && option.score > 0) {
                        maximumScore += option.score;
                    }
                })
            }

        } else if (
            question.type === QuestionType.ShortTextField || 
            question.type === QuestionType.DetailedTextField
        ) {
            if (isTextAnswer(question.correctAnswer) && question.correctAnswer?.score) {
                maximumScore += question.correctAnswer.score;
            }
        }

        return maximumScore;
    }

    const getCorrectAnswers = (question: IQuestion) => {
        let correctAnswers: string[] = [];

        if (question.options) {
            if (isSetOfOptions(question.options)) {
                question.options.forEach(option => {
                    if (option.score && option.score > 0) {
                        correctAnswers.push(option.label);
                    }
                })
            } else if (isMatches(question.options)) {
                question.options.leftList.forEach(option => {
                    correctAnswers.push(
                        `${option.id}) => ${makeOptionIdLetter(option.relatedOptionId as number)})`
                    );
                })
            }
        } else if (isTextAnswer(question.correctAnswer)) {
            correctAnswers.push(question.correctAnswer.text);
        }

        return correctAnswers;
    }

    const getFeedback = (answerToQuestion: IAnswerToQuestion): IFeedback | undefined => {
        const answer = answerToQuestion.answer;
        const question = answerToQuestion.question;

        let totalScore: number = 0, maximumScore: number = 0;

        maximumScore = getMaximumScore(question);
        const correctAnswers = getCorrectAnswers(question);

        if ((isOption(answer) || isTextAnswer(answer))) {
            if (answer?.score === undefined) {
                return undefined;
            }

            totalScore = answer.score;

        } else if (isMatches(answer)) {
            if (answer?.leftList[0].score === undefined) {
                return undefined;
            }

            answer.leftList.forEach(option => {
                totalScore += option.score as number;
            })

        } else if (isSetOfOptions(answer)) {
            if (answer[0]?.score === undefined && answer.length !== 0) {
                return undefined;
            };

            answer.forEach(option => {
                totalScore += option.score as number;
            })
        }

        return { totalScore, maximumScore, correctAnswers } as IFeedback;
    }

    const feedback = getFeedback(answerToQuestion);

    return (
        <div className={style.Answer} style={cssProperties}>
            <Typography 
                variant={"h6"} 
                component={"h6"} 
                sx = {{ marginBottom: '20px' }} 
            >
                { answerToQuestion.question.topic }
            </Typography>
            { renderResponseField(answerToQuestion.question, answerToQuestion.answer) }
            { feedback && <Feedback feedback={feedback} /> }
        </div>
    );
}

export default Answer;