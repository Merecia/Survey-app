import { FC } from 'react';

type InputType = 'text' | 'number'

interface InputProps {
    value: string;
    onChangeHandler: (parameters: any) => void;
    type?: InputType;
    disabled?: boolean;
    cssProperties?: React.CSSProperties;
}

const Input: FC<InputProps> = ({ 
    disabled, 
    onChangeHandler,
    type, 
    value,
    cssProperties
}) => {
    return (
        <input
            disabled = {disabled}
            type={type || 'text'}
            value={value}
            onChange={onChangeHandler}
            style = {cssProperties}
        />
    );
}

export default Input;