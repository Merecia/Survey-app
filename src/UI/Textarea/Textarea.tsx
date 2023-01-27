import { FC } from 'react';

interface TextareaProps {
    text: string;
    onChangeHandler: any;
    length: number;
    height: number;
}

const Textarea: FC<TextareaProps> = ({
    onChangeHandler,
    text,
    length,
    height
}) => {
    return (
        <textarea
            cols={length}
            rows={height}
            value={text}
            onChange={onChangeHandler}
            style={{'resize': 'none'}}
        />
    );
}

export default Textarea;