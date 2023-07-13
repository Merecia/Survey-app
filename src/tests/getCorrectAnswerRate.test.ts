import { getCorrectAnswersRate } from "../helper"

describe('Get correct answer rate', () => {
    test('All answers are correct', () => {
        expect(getCorrectAnswersRate(15, 15)).toBe(100);
    })

    test('There are both correct and uncorrect answers', () => {
        expect(getCorrectAnswersRate(8, 15)).toBe(53.33);
    })

    test ('All answers are incorrect and earned score is 0', () => {
        expect(getCorrectAnswersRate(0, 15)).toBe(0);
    })

    test ('All answers are incorrect and earned score is less than 0', () => {
        expect(getCorrectAnswersRate(0, 15)).toBe(0);
    })
})