import { FC } from 'react';

interface SelectProps {
    id: number;
    value: string;
    options: string[];
    onChangeHandler: (parameters: any) => void;
}

const Select: FC<SelectProps> = ({id, options, value, onChangeHandler}) => {

    const renderOptions = () => options.map((option, index) => 
        renderOption(option, index)
    );

    const renderOption = (label: string, index: number) => (
        <option key = {index} value = {label}> 
            {label} 
        </option>
    );

    return (
        <select 
            key = {id} 
            value = {value} 
            onChange = {onChangeHandler} 
        >
            <option value = ''/>
            {renderOptions()}
        </select>
    );
}

export default Select;