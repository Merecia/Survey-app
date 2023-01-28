import {FC} from 'react';
import style from './Button.module.scss';

interface ButtonProps {
    label: string;
    clickHandler: any;
    margin: string;
    width: string;
}

const Button: FC<ButtonProps> = ({label, clickHandler, margin, width}) => {
    return (
        <button 
            className = {style.Button}
            onClick = {clickHandler}
            style = {{margin, width}}
        >
            {label}
        </button>
    );
}

export default Button;