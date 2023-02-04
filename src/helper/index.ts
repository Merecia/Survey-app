import { IOption, ITextAnswer } from './../types/survey';

export const remove = <T>(array: T[], index: number): T[] => {

    const updatedArray: T[] = [...array];

    updatedArray.splice(index, 1);

    return updatedArray;
}

export const isOption = (entity: any): entity is IOption => (
    'id' in entity && 'label' in entity
)

export const isTextAnswer = (entity: any): entity is ITextAnswer => (
    'text' in entity
)

