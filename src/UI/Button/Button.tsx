import {FC} from 'react';
import style from './Button.module.scss';

interface ButtonProps {
    label: string;
    clickHandler: (parameters: any) => void;
    cssProperties?: React.CSSProperties;
    disabled?: boolean;
}

const Button: FC<ButtonProps> = ({
    label, 
    clickHandler,
    cssProperties,
    disabled
}) => {
    return (
        <button 
            className = {style.Button}
            onClick = {clickHandler}
            style = {cssProperties}
            disabled = {disabled}
        >
            {label}
        </button>
    );
}

export default Button;