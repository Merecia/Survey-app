import { FC } from 'react';
import style from './SurveyFinsihModal.module.scss';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useActions } from '../../../hooks/useActions';
import { Typography } from '@mui/material';

interface ISurveyFinishModalProps {
    surveyResultsId: number;
    earnedScore?: number | undefined;
    maximumScore?: number | undefined;
}

const SurveyFinishModal: FC<ISurveyFinishModalProps> = ({
    surveyResultsId,
    earnedScore,
    maximumScore
}) => {
    const isEvaluated = earnedScore !== undefined && maximumScore !== undefined;
    const navigate = useNavigate();
    const { clearQuestions } = useActions();

    const viewResultsButtonClickHandler = () => {
        clearQuestions();
        navigate(`/survey-results/${surveyResultsId}`)
    }

    const toMainPageButtonClickHandler = () => {
        clearQuestions();
        navigate(`/`);
    }

    return (
        <div className={style.SurveyFinishModal}>
            <div className={style.Box}>
                <div className={style.Text}>
                    <Typography variant={"h6"} component={"h6"} fontWeight={'300'} >
                        You have finished passing the {isEvaluated ? 'Test' : 'Survey'}
                    </Typography>
                    {
                        isEvaluated &&
                        <Typography variant={"h6"} component={"h6"} fontWeight={'300'} >
                            Your score is {earnedScore} / {maximumScore}
                        </Typography>
                    }
                </div>
                <div className={style.Buttons}>
                    <Button
                        variant='contained'
                        onClick={viewResultsButtonClickHandler}
                        color='secondary'
                        sx={{ width: '40%', padding: '10px' }}
                    >
                        View Results
                    </Button>

                    <Button
                        variant='contained'
                        onClick={toMainPageButtonClickHandler}
                        color='secondary'
                        sx={{ width: '40%', padding: '10px' }}
                    >
                        To main page
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SurveyFinishModal;