export interface Answer {
    id: number;
    label: string;
}

export enum QuestionType {
    OneChoice,
    MultipleChoice,
    ShortTextField,
    DetailedTextField    
}

export enum TextFieldType {
    Short,
    Detailed
}