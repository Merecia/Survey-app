import { FC } from 'react';

interface InputProps {
    string: string;
    onChangeHandler: any;
}

const Input: FC<InputProps> = ({ onChangeHandler, string }) => {

    return (
        <input
            type="text"
            value={string}
            onChange={onChangeHandler}
        />
    );
}

export default Input;