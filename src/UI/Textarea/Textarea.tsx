import { FC } from 'react';
import style from './Textarea.module.scss';

interface TextareaProps {
    value: string;
    onChangeHandler: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    cssProperties?: React.CSSProperties;
    disabled?: boolean;
}

const Textarea: FC<TextareaProps> = ({
    onChangeHandler,
    value,
    disabled,
    cssProperties
}) => {
    return (
        <textarea
            value={value}
            onChange={onChangeHandler}
            disabled = {disabled}
            style={cssProperties}
            className={style.Textarea}
        />
    );
}

export default Textarea;