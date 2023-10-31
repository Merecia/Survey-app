import { 
    IMatches, IOption, ITextAnswer, 
    IQuestion, QuestionType, 
    IAnswerToQuestion, IFeedback, ISurvey, ISurveyInfo 
} from '../types/survey';

export const remove = <T>(array: T[], index: number): T[] => {
    const updatedArray: T[] = [...array];
    updatedArray.splice(index, 1);
    return updatedArray;
}

export const isOption = (entity: any): entity is IOption => (
    entity && 'id' in entity && 'label' in entity
)

export const isTextAnswer = (entity: any): entity is ITextAnswer => (
    entity && 'text' in entity
)

export const isMatches = (entity: any): entity is IMatches => (
    entity && 'leftList' in entity && 'rightList' in entity
)

export const isQuestion = (entity: any): entity is IQuestion => (
    entity && 'id' in entity && 'topic' in entity && 'type' in entity && 'required' in entity
)

export const isSetOfOptions = (entity: any): entity is IOption[] => (
    Array.isArray(entity) && entity.every(item => isOption(item))
)

export const isNumber = (val: any) => typeof val === "number";

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
        return '';
    }
}

export const makeOptionIdLetter = (id: number): string => {
    return replaceNumberWithLetter(id).toUpperCase()
}

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
        return -1;
    }
}

export const getCorrectAnswers = (question: IQuestion) => {
    let correctAnswers: string[] = [];

    if (question.options) {
        if (isSetOfOptions(question.options)) {
            question.options.forEach(option => {
                if (option.score && option.score > 0) {
                    correctAnswers.push(option.label);
                }
            })
        } else if (isMatches(question.options)) {
            question.options.leftList.forEach(option => {
                correctAnswers.push(
                    `${option.id}) => ${makeOptionIdLetter(option.relatedOptionId as number)})`
                );
            })
        }
    } else if (isTextAnswer(question.correctAnswer)) {
        correctAnswers.push(question.correctAnswer.text);
    }

    return correctAnswers;
}

export const getMaximumScore = (question: IQuestion): number => {
    let maximumScore: number = 0;

    if (question.options) {
        if (isMatches(question.options)) {
            question.options.leftList.forEach(option => {
                if (option.score && option.score > 0) {
                    maximumScore += option.score;
                }
            })
        }

        else if (
            question.type === QuestionType.OneChoice ||
            question.type === QuestionType.MultipleChoice
        ) {
            question.options.forEach(option => {
                if (option.score && option.score > 0) {
                    maximumScore += option.score;
                }
            })
        }

    } else if (
        question.type === QuestionType.ShortTextField || 
        question.type === QuestionType.DetailedTextField
    ) {
        if (isTextAnswer(question.correctAnswer) && question.correctAnswer?.score) {
            maximumScore += question.correctAnswer.score;
        }
    }

    return maximumScore;
}

export const getFeedback = (answerToQuestion: IAnswerToQuestion): IFeedback => {
    const answer = answerToQuestion.answer;
    const question = answerToQuestion.question;

    let totalScore: number = 0, maximumScore: number = 0;

    maximumScore = getMaximumScore(question);
    const correctAnswers = getCorrectAnswers(question);

    if ((isOption(answer) || isTextAnswer(answer))) {
        totalScore = answer.score as number;
    } else if (isMatches(answer)) {
        answer.leftList.forEach(option => {
            totalScore += option.score as number;
        })
    } else if (isSetOfOptions(answer)) {
        answer.forEach(option => {
            totalScore += option.score as number;
        })
    }

    return { totalScore, maximumScore, correctAnswers } as IFeedback;
}

export const areAllRequiredQuestionsAnswered = (
    questions: IQuestion[], 
    answersToQuestions: IAnswerToQuestion[]
): boolean => {
    const requiredQuestionsId: number[] = [];

    questions.forEach(question => {
        if (question.required) {
            requiredQuestionsId.push(question.id);
        }
    })

    const answeredQuestionsId: number[] = answersToQuestions.map(
        answerToQuestion => answerToQuestion.question.id
    );

    let allRequiredQuestionsAreAnswered = true;

    requiredQuestionsId.forEach(requiredQuestionId => {
        if (!answeredQuestionsId.includes(requiredQuestionId)) {
            allRequiredQuestionsAreAnswered = false;
        }
    })

    return allRequiredQuestionsAreAnswered;
}

export const areAllQuestionsFilledOut = (questions: IQuestion[], isEvaluated: boolean) => {
    for (const question of questions) {
        if (question.topic === '') {
            return false;
        }

        if (
            question.type === QuestionType.OneChoice || 
            question.type === QuestionType.MultipleChoice
        ) {
            for (const option of question.options as IOption[]) {
                if (option.label === '') {
                    return false;
                }
            }
        } else if (
            question.type === QuestionType.ShortTextField ||
            question.type === QuestionType.DetailedTextField
        ) {
            if (isEvaluated && question.correctAnswer?.text === '') {
                return false;
            }
        } else if (
            question.type === QuestionType.Matchmaking &&
            isMatches(question.options)
        ) {
            for (const option of question.options.leftList) {
                if (option.label === '') return false;
            }
            for (const option of question.options.rightList) {
                if (option.label === '') return false;
            }
        }
    }

    return true;
}

export const calculateEarnedScore = (answersToQuestions: IAnswerToQuestion[]): number => {
    let earnedScore: number = 0;

    answersToQuestions.forEach(answerToQuestion => {
        const answer = answerToQuestion.answer;

        if (isOption(answer) || isTextAnswer(answer)) {
            if (answer.score) {
                earnedScore += answer.score;
            }
        } else if (isMatches(answer)) {
            answer.leftList.forEach(option => {
                if (option.score) {
                    earnedScore += option.score;
                }
            })
        } else if (isSetOfOptions(answer)) {
            answer.forEach(option => {
                if (option.score) {
                    earnedScore += option.score;
                }
            })
        }
    })

    return earnedScore;
}

export const calculateMaximumScore = (questions: IQuestion[]) => {
    let maximumScore: number = 0;

    questions.forEach(question => {
        if (
            question.type === QuestionType.OneChoice || 
            question.type === QuestionType.MultipleChoice
        ) {
            if (isSetOfOptions(question.options)) {
                question.options.forEach(option => {
                    if (option.score !== undefined && option.score > 0) { 
                        maximumScore += option.score as number;
                    }
                })
            }
        } else if (
            question.type === QuestionType.ShortTextField || 
            question.type === QuestionType.DetailedTextField
        ) {
            if (
                isTextAnswer(question.correctAnswer) 
                && question.correctAnswer.score !== undefined 
                && question.correctAnswer.score > 0
            ) {
                maximumScore += question.correctAnswer.score as number;
            }
        } else if (question.type === QuestionType.Matchmaking) {
            if (isMatches(question.options)) {
                question.options.leftList.forEach(option => {
                    if (option.score !== undefined && option.score > 0) {
                        maximumScore += option.score as number;
                    }
                })
            }
        }
    })

    return maximumScore;
}

const stringToColor = (string: string) => {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
}

export const stringAvatar = (name: string) => {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}

const getTwoDigitsString = (number: number) => {
    let twoDigitString = '';

    try {
        if (String(number).length > 2) {
            throw new Error('Something is wrong');
        } else if (String(number).length === 2) {
            twoDigitString = String(number);
        } else if (String(number).length === 1) {
            twoDigitString = '0' + String(number);
        } else if (String(number).length === 0) {
            twoDigitString = '00';
        }
    } catch(error) {
        return undefined;
    }

    return twoDigitString;
}

export const getPrettyPassingTime = (passingTimeSeconds: number) => {
    if (passingTimeSeconds < 0) return undefined;
    if (passingTimeSeconds === 0) return '00:00:00';

    const hours = Math.floor(passingTimeSeconds / 3600);
    const minutes = Math.floor( ( passingTimeSeconds - (hours * 3600) ) / 60 );
    const seconds = passingTimeSeconds - ( ( minutes * 60 ) + ( hours * 3600 ) );

    const prettyHours = getTwoDigitsString(hours);
    const prettyMinutes = getTwoDigitsString(minutes);
    const prettySeconds = getTwoDigitsString(seconds);

    return prettyHours + ':' + prettyMinutes + ':' + prettySeconds;
}

export const getPrettyDateTime = (date: Date) => {
    const prettyDate = getTwoDigitsString(date.getDate());
    const prettyMonth = getTwoDigitsString(date.getMonth() + 1);
    const prettyYear = date.getFullYear();
    
    const prettyHours = getTwoDigitsString(date.getHours());
    const prettyMinutes = getTwoDigitsString(date.getMinutes());
    const prettyTime =  prettyHours + ':' + prettyMinutes;

    return prettyDate + '.' + prettyMonth + '.' + prettyYear + ' ' + prettyTime;
}

export const roundWithAccuracy = (number: number, accuracy: number) => {
    return Math.round(number * 10 ** accuracy) / (10 ** accuracy);
}

export const getCorrectAnswersRate = (earnedScore: number, maximumScore: number) => {
    if (earnedScore <= 0) return 0;
    return roundWithAccuracy(earnedScore / maximumScore * 100, 2);
}