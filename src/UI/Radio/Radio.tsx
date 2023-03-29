import { FC } from 'react';
import style from './Radio.module.scss';

interface RadioProps {
    value: string;
    label: string;
    checked?: boolean;
    disabled?: boolean;
    onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioButton: FC<RadioProps> = ({
    value,
    checked,
    label,
    disabled,
    onChangeHandler
}) => {
    return (
        <div className={style.Radio}>
            <input
                name={label}
                type='radio'
                checked={checked}
                disabled={disabled}
                value={value}
                onChange = {onChangeHandler}
            />
            <label
                htmlFor={label}
            >
                {label}
            </label>
        </div>
    );
}

export default RadioButton;