import { FC } from 'react';

interface InputProps {
    string: string;
    width: string;
    onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
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