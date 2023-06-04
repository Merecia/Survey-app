import React, { FC, useMemo } from 'react';
import { IOption, IQuestion } from '../../../types/survey';
import style from './MatchmakingQuestionConstruct.module.scss';
import { isMatches } from '../../../helper';
import { TextField, Button } from '@mui/material';
import { useActions } from '../../../hooks/useActions';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import LeftListOption from './LeftListOption/LeftListOption';
import RightListOption from './RightListOption/RightListOption';

interface IMatchmakingQuestionConstructProps {
    question: IQuestion;
    cssProperties?: React.CSSProperties;
}

const MatchmakingQuestionConstruct: FC<IMatchmakingQuestionConstructProps> = ({
    question,
    cssProperties
}) => {
    const { updateQuestion } = useActions();
    const { surveyInfo } = useTypedSelector(state => state.survey);

    const renderLeftList = (leftList: IOption[]) => {
        return leftList.map(option => renderLeftListOption(option));
    }
    const renderRightList = (rightList: IOption[]) => {
        return rightList.map(option => renderRightListOption(option));
    }

    console.log(question);

    const updateLeftList = (leftList: IOption[]) => {
        if (isMatches(question.options)) {
            question.options.leftList = leftList;
            updateQuestion(question);
        }
    }

    const updateRightList = (rightList: IOption[]) => {
        if (isMatches(question.options)) {
            question.options.rightList = rightList;
            updateQuestion(question);
        }
    }

    const matchesScoreChangeHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (isMatches(question.options)) {
            question.options.leftList = question.options.leftList.map(option => {
                return {
                    id: option.id,
                    label: option.label,
                    relatedOptionId: option.relatedOptionId,
                    score: Number(event.target.value)
                };
            });
            updateQuestion(question);
        }
    }

    const renderLeftListOption = (option: IOption) => (
        <LeftListOption
            option={option}
            question={question}
            cssProperties={{ marginBottom: '15px' }}
        />
    )

    const renderRightListOption = (option: IOption) => (
        <RightListOption
            option={option}
            question={question}
            cssProperties={{ marginBottom: '15px' }}
        />
    )

    const addNewLeftListOption = () => {
        if (isMatches(question.options)) {
            const lastId = question.options.leftList.length;
            const newOption: IOption = { id: lastId + 1, label: '' };

            if (surveyInfo.isEvaluated) {
                newOption.relatedOptionId = 1;
                newOption.score = question.options.leftList[0].score;
            }

            const updatedLeftList = [...question.options.leftList];
            updatedLeftList.push(newOption);
            updateLeftList(updatedLeftList);
        }
    }

    const addNewRightListOption = () => {
        if (isMatches(question.options)) {
            const lastId = question.options.rightList.length;
            const updatedRightList = [...question.options.rightList];
            const newOption = { id: lastId + 1, label: '' };

            updatedRightList.push(newOption);
            updateRightList(updatedRightList);
        }
    }

    const renderScore = () => {
        if (surveyInfo.isEvaluated) {
            <TextField
                label="Enter score for a correct answer"
                size='small'
                fullWidth
                value={
                    isMatches(question.options) && question.options.leftList[0].score
                        ? question.options.leftList[0].score : 0
                }
                onChange={matchesScoreChangeHandler}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
        } else return <div> Empty </div>
    }

    return (
        <div
            className={style.MatchmakingQuestionConstruct}
            style={cssProperties}
        >
            <div className={style.Matches}>
                <div className={style.LeftList}>
                    {isMatches(question.options) && renderLeftList(question.options.leftList)}
                    <Button
                        variant='contained'
                        onClick={addNewLeftListOption}
                        sx={{ marginTop: '10px', width: '100%' }}
                    >
                        Add a new option
                    </Button>
                </div>
                <div className={style.RightList}>
                    {isMatches(question.options) && renderRightList(question.options.rightList)}
                    <Button
                        variant='contained'
                        onClick={addNewRightListOption}
                        sx={{ marginTop: '10px', width: '100%' }}
                    >
                        Add a new option
                    </Button>
                </div>
            </div>
            <div className={style.Footer}>
                {
                    useMemo(() => renderScore(), [question?.options]) 
                }
            </div>
        </div>
    );
}

export default React.memo(MatchmakingQuestionConstruct);