import { FC } from 'react';
import {
    isMatches,
    isTextAnswer,
    isOption,
    isSetOfOptions,
    makeOptionIdLetter
} from '../../helper';
import { IAnswer, IAnswerToQuestion, IFeedback, IOption } from '../../types/survey';
import { IQuestion, QuestionType, TextFieldType } from '../../types/survey';
import style from './Answer.module.scss';
import Matchmaking from '../Matchmaking/Matchmaking';
import MultipleChoice from '../MultipleChoice/MultipleChoice';
import SingleChoice from '../SingleChoice/SingleChoice';
import TextField from '../TextField/TextField';
import Feedback from '../Feedback/Feedback';

interface IAnswerProps {
    answerToQuestion: IAnswerToQuestion;
    margin?: string;
}

const Answer: FC<IAnswerProps> = ({ answerToQuestion, margin }) => {

    const renderResponseField = (question: IQuestion, answer: IAnswer) => {
        if (question.options) {
            if (isMatches(question.options)) {
                return <Matchmaking
                    id={question.id}
                    required={question.required}
                    topic={question.topic}
                    disabled={true}
                    leftList={question.options.leftList}
                    rightList={question.options.rightList}
                    selectedMatches={isMatches(answer) ? answer : undefined}
                />
            } else {
                if (question.type === QuestionType.OneChoice) {
                    return <SingleChoice
                        id={question.id}
                        required={question.required}
                        disabled={true}
                        topic={question.topic}
                        options={question.options}
                        selectedOption={isOption(answer) ? answer.id : undefined}
                    />
                }
                else if (question.type === QuestionType.MultipleChoice) {
                    return <MultipleChoice
                        id={question.id}
                        disabled={true}
                        required={question.required}
                        topic={question.topic}
                        options={question.options}
                        selectedOptions={
                            isSetOfOptions(answer)
                                ? answer.map(option => option.id)
                                : undefined
                        }
                    />
                }
            }
        } else {
            if (question.type === QuestionType.ShortTextField) {
                return <TextField
                    id={question.id}
                    type={TextFieldType.Short}
                    disabled={true}
                    required={question.required}
                    correctAnswer={question.correctAnswer}
                    givedAnswer={isTextAnswer(answer) ? answer : undefined}
                    topic={question.topic}
                />
            } else if (question.type === QuestionType.DetailedTextField) {
                return <TextField
                    id={question.id}
                    disabled={true}
                    type={TextFieldType.Detailed}
                    required={question.required}
                    topic={question.topic}
                />
            }
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

        } else if (question.type === QuestionType.ShortTextField) {
            if (question.correctAnswer?.score) {
                maximumScore += question.correctAnswer.score;
            }
        }

        return maximumScore;
    }

    const getOptionById = (list: IOption[], optionId: number) => {
        return list.find(option => option.id === optionId);
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
                const leftList = question.options.leftList;
                const rightList = question.options.rightList;

                leftList.forEach(option => {
                    const correctMatch = getOptionById(
                        rightList,
                        option.relatedOptionId as number
                    )?.label;

                    correctAnswers.push(
                        `${option.id}) ${option.label} => ` +
                        `${makeOptionIdLetter(option.relatedOptionId as number)}) ${correctMatch}`
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

        return {
            totalScore,
            maximumScore,
            correctAnswers
        } as IFeedback;
    }

    const renderFeedback = (feedback: IFeedback) => {
        return <Feedback
            feedback={feedback}
            margin='20px 0px 0px 0px'
        />
    }

    const feedback = getFeedback(answerToQuestion);

    return (
        <div className={style.Answer} style={{ margin }}>
            <p> {answerToQuestion.question.topic} </p>
            {renderResponseField(answerToQuestion.question, answerToQuestion.answer)}
            {feedback ? renderFeedback(feedback) : null}
        </div>
    );
}

export default Answer;