import { FC, useState } from 'react';
import { IOption } from '../../types/survey';
import Radio from '../../UI/Radio/Radio';

interface SingleChoiceProps {
    id: number;
    options: IOption[];
}

const SingleChoice: FC<SingleChoiceProps> = ({id, options}) => {

    const [selectedOption, setSelectedOption] = useState<Number>();

    console.log(`В вопросе ${id} пользователь дал ответ: ${selectedOption}`);

    const radioHandler = (event: React.ChangeEvent<HTMLInputElement>) => {

        setSelectedOption(Number(event.target.value));
    }

    const renderOptions = () => {
        return options.map((option: IOption) =>
            <Radio
                key={option.id}
                id={option.id}
                label={option.label}
                onChangeHandler={radioHandler}
                checked={selectedOption === option.id}
            />
        )
    }

    return (
        <>
            { renderOptions() }
        </>
    );
}

export default SingleChoice;