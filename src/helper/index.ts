import { IMatches, IOption, ITextAnswer } from './../types/survey';

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

export const isMatches = (entity: any): entity is IMatches => (
    'leftList' in entity && 'rightList' in entity
)

export const isSetOfOptions = (entity: any): entity is IOption[] => (
    Array.isArray(entity) && entity.every(item => isOption(item))
)

export const replaceNumberWithLetter = (number: number): string => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

    try {
        if (number > alphabet.length || number < 1) {
            throw new Error(
                `It is impossible to replace this 
                number with a letter of the alphabet`
            );
        } else {
            return alphabet[number - 1];
        }
    } catch (error) {
        console.log(error);
        return '';
    }
}

export const makeOptionIdLetter = (id: number): string => (
    replaceNumberWithLetter(id).toUpperCase()
)

export const replaceLetterWithNumber = (letter: string): number => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

    try {
        if (letter.length !== 1) {
            throw new Error(`A letter must be passed in the parameters`);
        } else {
            const index = alphabet.findIndex(letterFromAlphabet =>
                letterFromAlphabet === letter.toLowerCase()
            );

            if (index === -1) {
                throw new Error(`There is no such letter in the alphabet`);
            }

            return index + 1;
        }

    } catch (error) {
        console.log(error);
        return -1;
    }
}

