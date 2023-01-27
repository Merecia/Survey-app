import { FC, useState } from 'react';
import { TextFieldType } from '../../types/survey';
import Input from '../../UI/Input/Input';
import Textarea from '../../UI/Textarea/Textarea';

interface TextFieldProps {
    id: number;
    type: TextFieldType;
}

const TextField: FC<TextFieldProps> = ({ id, type }) => {

    const [text, setText] = useState<string>('');

    console.log(`В вопросе ${id} пользователь ответил ${text}`);

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
                width={'100%'}
                height={'100px'}
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