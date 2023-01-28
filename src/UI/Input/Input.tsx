import { FC } from 'react';

interface InputProps {
    string: string;
    onChangeHandler: any;
    width: string;
}

const Input: FC<InputProps> = ({ onChangeHandler, string, width }) => {
    return (
        <input
            type="text"
            value={string}
            onChange={onChangeHandler}
            style = {{
                width
            }}
        />
    );
}

export default Input;