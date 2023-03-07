import {FC} from 'react';
import style from './Button.module.scss';

interface ButtonProps {
    label: string;
    clickHandler: any;
    margin?: string;
    width?: string;
    disabled?: boolean;
}

const Button: FC<ButtonProps> = ({
    label, 
    clickHandler, 
    margin, 
    width,
    disabled
}) => {
    return (
        <button 
            className = {style.Button}
            onClick = {clickHandler}
            style = {{margin, width}}
            disabled = {disabled}
        >
            {label}
        </button>
    );
}

export default Button;