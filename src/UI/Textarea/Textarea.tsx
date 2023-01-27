import { FC } from 'react';

interface TextareaProps {
    text: string;
    onChangeHandler: any;
    width: string;
    height: string;
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