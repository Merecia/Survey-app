import React, { FC, useState, useEffect } from 'react';
import { useActions } from '../../hooks/useActions';
import {
    isMatches,
    isOption,
    makeOptionIdLetter,
    replaceLetterWithNumber
} from '../../helper';
import {
    IAnswer,
    IMatch,
    IMatches,
    IOption,
    IQuestion
} from '../../types/survey';
import { TextField, MenuItem } from '@mui/material';
import style from './Matchmaking.module.scss';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

interface IMatchmakingProps {
    question: IQuestion;
    selectedMatches?: IMatches;
}

const Matchmaking: FC<IMatchmakingProps> = ({ question, selectedMatches }) => {
    /*
        We will save matches as pairs of two numbers. Examples of the matches: 
        (1,2), (2,3), etc. The number of pairs will depend on the number of 
        options in the left list. For example, if in the left list 5 options,
        amount of pairs (amount of matches) will be 5.
    */
    const [matches, setMatches] = useState<IMatch[]>([]);
    const { updateAnswerToQuestion } = useActions();

    useEffect(() => {
        if (selectedMatches) {
            const matches: IMatch[] = [];

            selectedMatches.leftList.forEach(option => {
                matches.push({
                    leftListOptionId: option.id,
                    rightListOptionId: option.relatedOptionId as number
                });
            })

            setMatches(matches);
        }
        // eslint-disable-next-line
    }, [])

    const getCorrectAnswers = (options: IMatches): IMatch[] | null => {
        if (options.leftList[0].relatedOptionId) {
            return options.leftList.map(option => ({
                leftListOptionId: option.id,
                rightListOptionId: option.relatedOptionId || 0
            }));
        } else return null;
    }

    const updateLeftList = (updatedMatches: IMatch[]): IOption[] | undefined => {
        if (isMatches(question.options)) {
            const correctAnswers = getCorrectAnswers(question.options);

            return question.options.leftList.map(option => {
                const match = updatedMatches.find(match => match.leftListOptionId === option.id);

                const updatedOption: IOption = {
                    id: option.id,
                    label: option.label,
                    relatedOptionId: match?.rightListOptionId
                }

                if (correctAnswers) {
                    const correctAnswer = correctAnswers.find(answer => answer.leftListOptionId === option.id);
                    const score = JSON.stringify(match) === JSON.stringify(correctAnswer) ? option.score : 0;
                    updatedOption.score = score;
                }

                return updatedOption;
            });
        }
    }

    const onChangeHandler = (
        selectedOptionIdFromLeftList: number,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const matchIndex = matches.findIndex(selectedOption =>
            selectedOption.leftListOptionId === selectedOptionIdFromLeftList
        );

        let updatedMatches: IMatch[];

        if (matchIndex !== -1) {
            const match = matches[matchIndex];
            match.rightListOptionId = replaceLetterWithNumber(event.target.value);
            updatedMatches = [...matches];
            updatedMatches[matchIndex] = match;
        } else {
            updatedMatches = [...matches, {
                leftListOptionId: selectedOptionIdFromLeftList,
                rightListOptionId: replaceLetterWithNumber(event.target.value)
            }];
        }

        setMatches(updatedMatches);

        const updatedLeftList = updateLeftList(updatedMatches);

        if (updatedLeftList && isMatches(question.options)) {
            const answer: IAnswer = {
                leftList: updatedLeftList,
                rightList: question.options.rightList
            };

            updateAnswerToQuestion({ answer, question });
        }
    }

    const renderOption = (id: number | string, label: string) => (
        <div className={style.Option} key={id}> {id}. {label} </div>
    )

    const renderPossibleRelatedOptions = (rightList: IOption[]) => {
        if (isMatches(question.options)) {
            return rightList.map(option => {
                return (
                    <MenuItem value = { makeOptionIdLetter(option.id) }> 
                        { makeOptionIdLetter(option.id) } 
                    </MenuItem>
                );
            });
        }
    }

    /*
        This function will find the match for the leftListOptionId from the selectedOptions.
        If we can't find a match (for example, in cases when the user doesn't 
        choose the option yet).
    */
    const findMatch = (leftListOptionId: number): number | undefined => {
        return matches.find(selectedOption =>
            selectedOption.leftListOptionId === leftListOptionId
        )?.rightListOptionId || undefined;
    }

    const isCorrectOption = (option: IAnswer) => {
        if (isOption(option)) {
            const match = findMatch(option.id);

            if (option.relatedOptionId === match) return true;

            return false;
        }
        return undefined;
    }
    
    const renderMark = (selectedOption: IAnswer) => {
        if (isOption(selectedOption) && selectedOption.score !== undefined) {
            if (isCorrectOption(selectedOption)) {
                return renderCheckmark();
            } else {
                return renderCrossmark();
            }
        } else {
            return null;
        }
    }

    const renderCheckmark = () => <span className={style.Checkmark}> <CheckCircleIcon /> </span>
    
    const renderCrossmark = () => <span className={style.Crossmark}> <CloseIcon /> </span>

    const renderLeftList = () => {
        if (isMatches(question.options)) {
            const { leftList, rightList } = question.options;

            return leftList.map(option => {
                const match = findMatch(option.id);

                return (
                    <div className={style.ListItem} key={option.id}>
                        {renderOption(option.id, option.label)}
                        <div className={style.Select}>
                            <TextField
                                size = 'small'
                                value={match ? makeOptionIdLetter(match) : ''}
                                onChange = { (event: React.ChangeEvent<HTMLInputElement>) => onChangeHandler(option.id, event) }
                                select
                                disabled = {selectedMatches !== undefined}
                            >
                                { renderPossibleRelatedOptions(rightList) }
                            </TextField> 

                            {selectedMatches ? renderMark(option) : null}
                        </div>
                    </div>
                );
            });
        }
    }

    const renderRightList = () => {
        if (isMatches(question.options)) {
            return question.options.rightList.map(option => (
                <div className={style.ListItem} key={option.id}>
                    {renderOption(makeOptionIdLetter(option.id), option.label)}
                </div>
            ));
        }
    }

    return (
        <div className={style.Matchmaking}>
            <div className={style.LeftList}>
                {renderLeftList()}
            </div>
            <div className={style.RightList}>
                {renderRightList()}
            </div>
        </div>
    );
}

export default React.memo(Matchmaking);