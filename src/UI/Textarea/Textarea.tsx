import { FC } from 'react';

interface TextareaProps {
    text: string;
    width: string;
    height: string;
    onChangeHandler: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea: FC<TextareaProps> = ({
    onChangeHandler,
    text,
    width,
    height
}) => {
    return (
        <textarea
            value={text}
            onChange={onChangeHandler}
            style={{
                'resize': 'none', 
                width,
                height
            }}
        />
    );
}

export default Textarea;