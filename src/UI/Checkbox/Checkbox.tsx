import {FC} from 'react';
import style from './Checkbox.module.scss';

interface CheckboxProps {
    id: number;
    label: string;
    checked?: boolean;
    onChangeHandler: any;
}

const Checkbox: FC<CheckboxProps> = ({id, label, checked, onChangeHandler}) => {
    return (
        <div className = {style.Checkbox}>
            <input 
                type="checkbox" 
                name={label} 
                checked={checked}
                value={id}
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
