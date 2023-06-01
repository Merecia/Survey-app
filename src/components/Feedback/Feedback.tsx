import { FC } from 'react';
import { IFeedback } from '../../types/survey';
import style from './Feedback.module.scss';
import { Alert, AlertTitle } from "@mui/material";

interface IFeedbackProps {
    feedback: IFeedback;
    cssProperties?: React.CSSProperties;
}

const Feedback: FC<IFeedbackProps> = ({ feedback, cssProperties }) => {
    const renderFeedback = () => {
        if (feedback.totalScore <= 0) {
            return (
                <Alert severity="error" sx={{ marginTop: '10px' }}>
                    <AlertTitle> Your answer is incorrect </AlertTitle>
                    { renderScore(feedback.totalScore, feedback.maximumScore) }
                    { renderCorrectAnswers() }
                </Alert>
            );
        } else if (feedback.totalScore > 0 && feedback.totalScore < feedback.maximumScore) {
            return (
                <Alert severity="warning" sx={{ marginTop: '10px' }}>
                    <AlertTitle> Your answer is partially correct </AlertTitle>
                    { renderScore(feedback.totalScore, feedback.maximumScore) }
                    { renderCorrectAnswers() }
                </Alert>
            )
        } else if (feedback.totalScore === feedback.maximumScore) {
            return (
                <Alert severity="success" sx={{ marginTop: '10px' }}>
                    <AlertTitle> Your answer is correct </AlertTitle>
                    { renderScore(feedback.totalScore, feedback.maximumScore) }
                </Alert>
            );
        }
    }

    const renderCorrectAnswers = () => {
        return (
            <div className = {style.Footnote}>
                { feedback.correctAnswers.length > 1 ? 'Correct answers are: ' : 'Correct answer is: ' }
                { feedback.correctAnswers.map((correctAnswer, index) => renderCorrectAnswer(correctAnswer, index)) }
            </div>
        );
    }

    const renderScore = (totalScore: number, maximumScore: number): JSX.Element => {
        return <p> `Your score is — <strong> {totalScore} / {maximumScore} </strong>` </p>
    }

    const renderCorrectAnswer = (correctAnswer: string, index: number) => <strong key={index}> {correctAnswer} </strong>

    return (
        <div className={style.Feedback} style={cssProperties}>
            {renderFeedback()}
        </div>
    );
}

export default Feedback;