import { FC } from 'react';

interface TextareaProps {
    text: string;
    width: string;
    height: string;
    disabled?: boolean;
    onChangeHandler: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea: FC<TextareaProps> = ({
    onChangeHandler,
    text,
    disabled,
    width,
    height
}) => {
    return (
        <textarea
            value={text}
            onChange={onChangeHandler}
            disabled = {disabled}
            style={{
                'resize': 'none', 
                width,
                height
            }}
        />
    );
}

export default Textarea;