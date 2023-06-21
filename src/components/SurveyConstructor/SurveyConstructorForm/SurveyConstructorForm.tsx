import React, { FC } from 'react';
import style from './SurveyConstructorForm.module.scss';
import { useForm } from 'react-hook-form';
import { IOption, IQuestion, ISurvey, ISurveyInfo, QuestionType, SurveyCategory, SurveyConstructorType } from '../../../types/survey';
import { TextField, Button, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import { useActions } from '../../../hooks/useActions';

interface ISurveyConstructFormProps {
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
    survey?: ISurvey;
}

const SurveyConstructForm: FC<ISurveyConstructFormProps> = ({ setShowForm, survey }) => {
    const {
        register,
        handleSubmit,
        watch, 
        formState: { errors }
    } = useForm({
        defaultValues: {
            title: survey?.surveyInfo.title || '',
            category: survey?.surveyInfo.category || '',
            description: survey?.surveyInfo.description || '',
            imageUrl: survey?.surveyInfo.imageUrl || '',
            timeLimit: survey?.surveyInfo.maximumPassingTimeSeconds !== undefined,
            maximumPassingTimeSeconds: survey?.surveyInfo.maximumPassingTimeSeconds || 600,
            isEvaluated: survey?.surveyInfo.isEvaluated || false
        }
    });

    const constructorType = survey ? SurveyConstructorType.Editing : SurveyConstructorType.Adding; 

    const timeLimit = watch('timeLimit');
    const category = watch('category');
    const isEvaluated = watch('isEvaluated');

    console.log(survey);

    const { updateSurveyInfo, updateQuestions } = useActions();

    const renderCategoriesOptions = (categories: string[]) => (
        categories.map((category, index) => 
            <MenuItem value = {category} key = {index}> {category} </MenuItem>
        )
    )

    const getInitialQuestions = (surveyInfo: ISurveyInfo): IQuestion[] => {
        const initialOption: IOption = { id: 1, label: '' };

        if (surveyInfo.isEvaluated) initialOption.score = 0;

        const initialQuestions: IQuestion[] = [{
            id: 1,
            topic: "",
            type: QuestionType.OneChoice,
            required: false,
            options: [initialOption]
        }];

        return initialQuestions;
    }

    const onSubmit = handleSubmit(async (form) => {
        const surveyInfo: ISurveyInfo = {
            title: form.title,
            category: form.category as SurveyCategory,
            description: form.description,
            imageUrl: form.imageUrl,
            isEvaluated: form.isEvaluated
        };

        if (timeLimit) {
            surveyInfo.maximumPassingTimeSeconds = form.maximumPassingTimeSeconds;
        }

        updateSurveyInfo(surveyInfo);

        if (constructorType === SurveyConstructorType.Adding) {
            const initialQuestions = getInitialQuestions(surveyInfo);
            updateQuestions(initialQuestions);
        } else if (constructorType === SurveyConstructorType.Editing) {
            updateQuestions((survey as ISurvey).questions);
        }

        setShowForm(false);
    })

    return (
        <form
            className={style.SurveyConstructForm}
            onSubmit={onSubmit}
        >
            <TextField 
                label = "Enter the title of the survey"
                size = 'small'
                fullWidth
                {
                    ...register(
                        'title', {
                            required: 'Title is required',
                            minLength: {
                                value: parseInt(process.env.REACT_APP_MIN_TITLE_LENGTH || '4'),
                                message: `The length of title must be more than 
                                ${process.env.REACT_APP_MIN_TITLE_LENGTH} symbols`
                            }
                        }
                    )
                }
                sx = {{ marginBottom: '20px' }}
                error = {errors.title?.message !== undefined}
                helperText = {errors.title?.message}
            />

            <TextField 
                label = "Enter the description of the survey"
                size = 'small'
                fullWidth
                {
                    ...register(
                        'description', {
                            required: 'Description is required',
                            minLength: {
                                value: parseInt(process.env.REACT_APP_MIN_DESCRIPTION_LENGTH || '4'),
                                message: `The length of description must be more than 
                                ${process.env.REACT_APP_MIN_DESCRIPTION_LENGTH} symbols`
                            }
                        }
                    )
                }
                sx = {{ marginBottom: '20px' }}
                error = {errors.description?.message !== undefined}
                helperText = {errors.description?.message}
            />

            <TextField
                { ...register('category', { required: 'Choose category' } ) } 
                label = 'Category'
                fullWidth
                select
                size = 'small'
                value = {category}
                sx = {{ marginBottom: '20px' }}
                error = {errors.category?.message !== undefined}
                helperText = {errors.category?.message}
            >
                { renderCategoriesOptions(Object.keys(SurveyCategory)) }
            </TextField>

            <TextField 
                label = "Enter the image URL to the survey"
                size = 'small'
                fullWidth
                {
                    ...register(
                        'imageUrl', {
                            required: 'Image URL is required',
                            minLength: {
                                value: parseInt(process.env.REACT_APP_MIN_IMAGE_URL_LENGTH || '6'),
                                message: `The length of URL must be more than 
                                ${process.env.REACT_APP_MIN_IMAGE_URL_LENGTH} symbols`
                            }
                        }
                    )
                }
                sx = {{ marginBottom: '20px' }}
                error = {errors.imageUrl?.message !== undefined}
                helperText = {errors.imageUrl?.message}
            />

            <FormControlLabel
                control={
                    <Checkbox
                        checked = {timeLimit}
                        { ...register('timeLimit') }
                    />
                }
                label="Is there a time limit for taking the survey?"
                sx = {{ marginBottom: '20px' }}
            />

            {
                timeLimit &&
                <TextField 
                    label = "Enter the maximum time of passing the survey in seconds"
                    size = 'small'
                    fullWidth
                    {
                        ...register('maximumPassingTimeSeconds', { 
                            required: 'You indicated that a time limit must be, but you did not specify how much',
                            pattern: {
                                value: /^[0-9]+$/,
                                message: 'Please enter a positive integer number',
                            }
                        }) 
                    }
                    sx = {{ marginBottom: '20px', padding: '0px' }}
                    error = {errors.maximumPassingTimeSeconds?.message !== undefined}
                    helperText = {errors.maximumPassingTimeSeconds?.message}
                />
            }

            <FormControlLabel
                control={
                    <Checkbox
                        checked = {isEvaluated}
                        { ...register('isEvaluated') }
                    />
                }
                label="Will the questions be graded?"
                sx = {{ marginBottom: '20px' }}
            />

            <Button variant = 'contained' type = 'submit' fullWidth> 
                Go to create questions 
            </Button>
        </form>
    )
}

export default SurveyConstructForm;