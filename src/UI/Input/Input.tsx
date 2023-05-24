import { FC } from 'react';

type InputType = 'text' | 'number'

interface InputProps {
    value: string | number;
    onChangeHandler: (parameters: any) => void;
    type?: InputType;
    disabled?: boolean;
    placeholder?: string;
    cssProperties?: React.CSSProperties;
}

const Input: FC<InputProps> = ({ 
    disabled, 
    onChangeHandler,
    type, 
    value,
    placeholder,
    cssProperties
}) => {
    return (
        <input
            disabled = {disabled}
            type={type || 'text'}
            value={value}
            placeholder = {placeholder}
            onChange={onChangeHandler}
            style = {cssProperties}
        />
    );
}

export default Input;