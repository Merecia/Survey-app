import { FC } from 'react';
import style from './Radio.module.scss';

interface RadioProps {
    id: number;
    label: string;
    checked?: boolean;
    disabled?: boolean;
    onChangeHandler: any;
}

const RadioButton: FC<RadioProps> = ({
    id,
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
                value={id}
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