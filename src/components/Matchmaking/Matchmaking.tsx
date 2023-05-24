import { FC, useState, useEffect } from 'react';
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
import Select from '../../UI/Select/Select';
import style from './Matchmaking.module.scss';

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
    const { updateAnswersToQuestions } = useActions();

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

    const getCorrectAnswers = (options: IMatches): IMatch[] => {
        return options.leftList.map(option => ({
            leftListOptionId: option.id,
            rightListOptionId: option.relatedOptionId || 0
        }));
    }

    const updateLeftList = (updatedMatches: IMatch[]): IOption[] | undefined => {
        if (isMatches(question.options)) {
            const correctAnswers = getCorrectAnswers(question.options);

            return question.options.leftList.map(option => {
                const match = updatedMatches.find(match => match.leftListOptionId === option.id);
                const correctAnswer = correctAnswers.find(answer => answer.leftListOptionId === option.id);
                const score = JSON.stringify(match) === JSON.stringify(correctAnswer) ? option.score : 0;

                return {
                    id: option.id,
                    label: option.label,
                    score: score,
                    relatedOptionId: match?.rightListOptionId
                };
            });
        }
    }

    const onChangeHandler = (
        selectedOptionIdFromLeftList: number,
        event: React.ChangeEvent<HTMLSelectElement>
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

            updateAnswersToQuestions({ answer, question });
        }
    }

    const renderOption = (id: number | string, label: string) => (
        <div className={style.Option} key={id}> {id}. {label} </div>
    )

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

            if (option.relatedOptionId === match) {
                return true;
            }

            return false;
        }
        return undefined;
    }

    const renderMark = (option: IAnswer) => isCorrectOption(option) ? renderCheckmark() : renderCrossmark();

    const renderCheckmark = () => <span className={style.Checkmark}> &#10003; </span>

    const renderCrossmark = () => <span className={style.Crossmark}> &#10060; </span>

    const renderLeftList = () => {
        if (!isMatches(question.options)) return;

        const {leftList, rightList} = question.options;

        return leftList.map(option => {
            const match = findMatch(option.id);

            return (
                <div className={style.ListItem} key={option.id}>
                    {renderOption(option.id, option.label)}
                    <div className={style.Select}>
                        <Select
                            id={option.id}
                            value={match ? makeOptionIdLetter(match) : ''}
                            options={rightList.map(option => makeOptionIdLetter(option.id))}
                            disabled={false}
                            onChangeHandler={
                                (event: React.ChangeEvent<HTMLSelectElement>) =>
                                    onChangeHandler(option.id, event)
                            }
                        />
                        {selectedMatches ? renderMark(option) : null}
                    </div>
                </div>
            );
        });
    }

    const renderRightList = () => {
        if (!isMatches(question.options)) return;

        return question.options.rightList.map(option => (
            <div className={style.ListItem} key={option.id}>
                {renderOption(makeOptionIdLetter(option.id), option.label)}
            </div>
        ));
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

export default Matchmaking;