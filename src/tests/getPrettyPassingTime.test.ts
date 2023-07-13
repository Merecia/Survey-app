import { getPrettyPassingTime } from "../helper";

describe('Get pretty passing time', () => {
    test('Passing time is more than one our', () => {
        expect(getPrettyPassingTime(3661)).toBe('01:01:01');
    })

    test('Passing time is less than one hour, but is more than one minute', () => {
        expect(getPrettyPassingTime(821)).toBe('00:13:41');
    })

    test ('Passing time is less than one minute', () => {
        expect(getPrettyPassingTime(52)).toBe('00:00:52');
    })

    test ('Passing time is 0 seconds', () => {
        expect(getPrettyPassingTime(0)).toBe('00:00:00');
    })

    test ('Incorrect data', () => {
        expect(getPrettyPassingTime(-1)).toBe(undefined);
    })
})