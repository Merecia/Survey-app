import { FC } from 'react';
import { IFeedback } from '../../types/survey';
import style from './Feedback.module.scss';

interface IFeedbackProps {
    feedback: IFeedback;
    cssProperties?: React.CSSProperties;
}

const Feedback: FC<IFeedbackProps> = ({ feedback, cssProperties }) => {
    const renderNote = () => {
        if (feedback.totalScore <= 0) {
            return 'You answered the question wrong.'
        } else if (feedback.totalScore > 0 && feedback.totalScore < feedback.maximumScore) {
            return 'You answered the questions partially correctly.'
        } else if (feedback.totalScore === feedback.maximumScore) {
            return 'You have answered the question correctly.'
        }
    }

    const renderFootnote = () => {
        return (
            <div className={style.Footnote}>
                <p> 
                    {
                        feedback.correctAnswers.length > 1 
                        ? 'Correct answers: ' 
                        : 'Correct answer: '
                    } 
                </p>
                {renderCorrectAnswers()}
            </div>
        );
    }

    const renderCorrectAnswers = () => feedback.correctAnswers.map(
        (correctAnswer, index) => renderCorrectAnswer(correctAnswer, index)
    );

    const renderCorrectAnswer = (correctAnswer: string, index: number) => {
        return <p key={index}> {correctAnswer} </p>
    }

    return (
        <div className={style.Feedback} style={cssProperties}>
            <div className={style.Header}>
                {renderNote()}
                <div className={style.Score}>
                    {feedback.totalScore} / {feedback.maximumScore}
                </div>
            </div>

            {feedback.totalScore !== feedback.maximumScore ? renderFootnote() : null}
        </div >
    );
}

export default Feedback;