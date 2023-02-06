import { FC, useState } from 'react';
import { replaceLetterWithNumber, replaceNumberWithLetter } from '../../helper';
import { IOption } from '../../types/survey';
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
    const [selectedOptions, setSelectedOptions] = useState<Match[]>([]);

    const onChangeHandler = (
        selectedOptionIdFromLeftList: number,
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {

        const matchIndex = selectedOptions.findIndex(selectedOption =>
            selectedOption.leftListOptionId === selectedOptionIdFromLeftList);

        let newSelectedOptions: Match[];

        if (matchIndex !== -1) {

            const match = selectedOptions[matchIndex];

            match.rightListOptionId = replaceLetterWithNumber(event.target.value);

            newSelectedOptions = [...selectedOptions];

            newSelectedOptions[matchIndex] = match;

        } else {

            newSelectedOptions = [...selectedOptions, {
                leftListOptionId: selectedOptionIdFromLeftList,
                rightListOptionId: replaceLetterWithNumber(event.target.value)
            }];

        }

        setSelectedOptions(newSelectedOptions);
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
    const findMatch = (leftListOptionId: number) => (
        selectedOptions.find(selectedOption =>
            selectedOption.leftListOptionId === leftListOptionId)
            ?.rightListOptionId || 1
    )

    const renderLeftList = () => {
        return leftList.map(option => (
            <div className={style.ListItem} key={option.id}>
                {renderOption(option.id, option.label)}
                <div className={style.Select}>
                    <Select
                        id={option.id}
                        value={makeOptionIdLetter(findMatch(option.id))}
                        options={rightList.map(option => makeOptionIdLetter(option.id))}
                        onChangeHandler={(event: React.ChangeEvent<HTMLSelectElement>) =>
                            onChangeHandler(option.id, event)}
                    />
                </div>
            </div>
        ));
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