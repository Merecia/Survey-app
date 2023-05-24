import {FC} from 'react';
import style from './Checkbox.module.scss';

interface CheckboxProps {
    label: string;
    value?: string;
    checked?: boolean;
    disabled?: boolean;
    onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
    cssProperties?: React.CSSProperties;
}

const Checkbox: FC<CheckboxProps> = ({
    value, 
    label, 
    checked,
    disabled, 
    onChangeHandler,
    cssProperties
}) => {
    return (
        <div className = {style.Checkbox} style = {cssProperties}>
            <input 
                type="checkbox" 
                name={label} 
                checked={checked}
                value={value ? value : label}
                disabled = {disabled}
                onChange={onChangeHandler}
            />
            <label 
                htmlFor={label}
            > 
                {label}
            </label>
        </div>
    );
}

export default Checkbox;
