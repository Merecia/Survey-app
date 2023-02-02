export function remove<T>(array: T[], index: number): T[] {

    const updatedArray: T[] = [...array];

    updatedArray.splice(index, 1);

    return updatedArray;
}

