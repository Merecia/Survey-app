import { FC, useEffect, useState } from 'react';
import { replaceLetterWithNumber, replaceNumberWithLetter } from '../../helper';
import { useActions } from '../../hooks/useActions';
import { 
    Answer, 
    IOption, 
    IQuestion, 
    QuestionType 
} from '../../types/survey';
import Select from '../../UI/Select/Select';
import style from './Matchmaking.module.scss';

interface MatchmakingProps {
    id: number;
    topic: string;
    leftList: IOption[];
    rightList: IOption[];
}

interface Match {
    leftListOptionId: number;
    rightListOptionId: number;
}

const Matchmaking: FC<MatchmakingProps> = ({ id, topic, leftList, rightList }) => {

    /*
        We will save matches as pairs of two numbers. Examples of the matches: 
        (1,2), (2,3), etc. The number of pairs will depend on the number of 
        options in the left list. For example, if in the left list 5 options,
        amount of pairs (amount of matches) will be 5.
    */
    const [matches, setMatches] = useState<Match[]>([]);
    const {updateAnswersQuestions} = useActions();

    useEffect(() => {

        const initialMatches: Match[] = leftList.map(option => {
            return {
                leftListOptionId: option.id,
                rightListOptionId: 1
            }
        });

        setMatches(initialMatches);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getCorrectAnswers = (): Match[] => {

        return leftList.map(option => ({
            leftListOptionId: option.id,
            rightListOptionId: option.relatedOptionId || 0
        }));
    }

    const onChangeHandler = (
        selectedOptionIdFromLeftList: number,
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {

        const matchIndex = matches.findIndex(selectedOption =>
        selectedOption.leftListOptionId === selectedOptionIdFromLeftList);

        let updatedMatches: Match[];

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

        const correctAnswers = getCorrectAnswers();

        const updatedLeftList = leftList.map(option => {

            const match = updatedMatches.find(match => match.leftListOptionId === option.id);

            const correctAnswer = correctAnswers.find(answer => answer.leftListOptionId === option.id);

            const score = JSON.stringify(match) === JSON.stringify(correctAnswer) ? option.score : 0;

            return {
                id: option.id,
                label: option.label,
                score: score,
                relatedOptionId: match?.rightListOptionId
            }
        })

        const answer: Answer = {
            leftList: updatedLeftList,
            rightList
        }

        const question: IQuestion = {
            id, 
            topic,
            options: {leftList, rightList},
            type: QuestionType.Matchmaking 
        }

        updateAnswersQuestions({answer, question});
    }

    const makeOptionIdLetter = (id: number): string => (
        replaceNumberWithLetter(id).toUpperCase()
    )

    const renderOption = (id: number | string, label: string) => (
        <div className={style.Option} key={id}> {id}. {label} </div>
    )

    /*
        This function will find the match for the leftListOptionId from the selectedOptions.
        If we can't find a match (for example, in cases when the user doesn't 
        choose the option yet), we take the default value 1 (that is A if this ID 
        will be translated to the letter). Therefore, all matches are set to A by default.
    */
    const findMatch = (leftListOptionId: number): number | undefined => {
        return matches.find(selectedOption =>
        selectedOption.leftListOptionId === leftListOptionId)
        ?.rightListOptionId || undefined;
    }

    const renderLeftList = () => {
        return leftList.map(option => {
            const match = findMatch(option.id);
            return (
                <div className={style.ListItem} key={option.id}>
                    {renderOption(option.id, option.label)}
                    <div className={style.Select}>
                        <Select
                            id={option.id}
                            value={match ? makeOptionIdLetter(match) : 'A'}
                            options={rightList.map(option => makeOptionIdLetter(option.id))}
                            onChangeHandler={(event: React.ChangeEvent<HTMLSelectElement>) =>
                                onChangeHandler(option.id, event)}
                        />
                    </div>
                </div>
            );
        });
    }

    const renderRightList = () => {
        return rightList.map(option => (
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