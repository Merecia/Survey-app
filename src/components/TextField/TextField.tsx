import { FC, useState } from 'react';
import { TextFieldType } from '../../types/survey';
import Input from '../../UI/Input/Input';
import Textarea from '../../UI/Textarea/Textarea';

interface TextFieldProps {
    type: TextFieldType
}

const TextField: FC<TextFieldProps> = ({ type }) => {

    const [text, setText] = useState<string>('');

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    }

    const renderTextField = () => {

        if (type === TextFieldType.Short) {
            return <Input
                string={text}
                onChangeHandler={onChangeHandler}
            />
        }

        else if (type === TextFieldType.Detailed) {
            return <Textarea
                text={text}
                onChangeHandler={onChangeHandler}
                length={80}
                height={5}
            />
        }
    }

    return (
        <>
            {renderTextField()}
        </>
    );

}

export default TextField;