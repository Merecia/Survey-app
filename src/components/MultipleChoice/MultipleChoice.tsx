import { FC, useState } from 'react';
import { remove } from '../../helper';
import { IOption } from '../../types/survey';
import Checkbox from '../../UI/Checkbox/Checkbox';

interface SingleChoiceProps {
    id: number;
    options: IOption[];
}

const MultipleChoice: FC<SingleChoiceProps> = ({id, options}) => {

    const [selectedOptions, setSelectedOptions] = useState<Number[]>([]);

    console.log(`В вопросе ${id} пользователь дал такие ответы: `);
    console.log(selectedOptions);

    const checkboxHandler = (event: React.ChangeEvent<HTMLInputElement>) => {

        const selectedOption = Number(event.target.value);

        if (selectedOptions.length !== 0) {

            let index = selectedOptions.indexOf(selectedOption);

            if (index === -1) {

                setSelectedOptions([...selectedOptions, selectedOption]);

            } else {

                setSelectedOptions(remove(selectedOptions, index));
            }

        } else {

            setSelectedOptions([selectedOption]);
        }
    }

    const renderOptions = () => {
        return options.map((answer: IOption) =>
            <Checkbox
                key={answer.id}
                id={answer.id}
                label={answer.label}
                onChangeHandler={checkboxHandler}
                checked={selectedOptions.includes(answer.id)}
            />
        )
    }

    return (
        <>
            { renderOptions() }
        </>
    );
}

export default MultipleChoice;