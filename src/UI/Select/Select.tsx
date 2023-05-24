import { FC } from 'react';
import style from './Select.module.scss';

interface SelectProps {
    id: number;
    value: string;
    options: string[];
    disabled?: boolean;
    onChangeHandler: (parameters: any) => void;
    cssProperties?: React.CSSProperties;
}

const Select: FC<SelectProps> = ({
    id, 
    options, 
    value, 
    onChangeHandler,
    cssProperties, 
    disabled
}) => {
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
            disabled = {disabled}
            className = {style.Select}
            style = {cssProperties}
        >
            <option value = ''/>
            {renderOptions()}
        </select>
    );
}

export default Select;