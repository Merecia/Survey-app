import { FC } from 'react';

interface InputProps {
    string: string;
    disabled?: boolean;
    width?: string;
    border?: string;
    onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: FC<InputProps> = ({ 
    disabled, 
    onChangeHandler, 
    string, 
    width,
    border
}) => {
    console.log(border);
    return (
        <input
            disabled = {disabled}
            type="text"
            value={string}
            onChange={onChangeHandler}
            style = {{
                width, border
            }}
        />
    );
}

export default Input;