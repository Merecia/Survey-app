import React, { FC } from 'react';
import style from './SurveyConstructForm.module.scss';
import { useForm } from 'react-hook-form';
import { Category, ISurveyInfo } from '../../../types/survey';
import { TextField, Button, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import { useActions } from '../../../hooks/useActions';

interface ISurveyConstructFormProps {
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const SurveyConstructForm: FC<ISurveyConstructFormProps> = ({ setShowForm }) => {
    const {
        register,
        handleSubmit,
        watch, 
        formState: { errors }
    } = useForm({
        defaultValues: {
            title: '',
            category: '',
            description: '',
            imageUrl: '',
            timeLimit: false,
            maximumPassingTimeSeconds: 600,
            isEvaluated: false
        }
    });

    const MIN_TITLE_LENGTH = 4;
    const MIN_DESCRIPTION_LENGTH = 4;
    const MIN_IMAGE_URL_LENGTH = 6;

    const timeLimit = watch('timeLimit');
    const category = watch('category');

    const { updateSurveyInfo } = useActions();

    const onSubmit = handleSubmit(async (data) => {
        const surveys = localStorage.getItem('surveys');
        console.log(surveys);

        let id;
        if (surveys) id = JSON.parse(surveys).pop().surveyInfo.id + 1;  
        else id = 1;

        const surveyInfo: ISurveyInfo = {
            id: id,
            title: data.title,
            category: data.category as Category,
            description: data.description,
            imageUrl: data.imageUrl,
            isEvaluated: data.isEvaluated
        };

        if (timeLimit) {
            surveyInfo.maximumPassingTimeSeconds = data.maximumPassingTimeSeconds;
        }

        console.log(surveyInfo);
        updateSurveyInfo(surveyInfo);
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
                                value: MIN_TITLE_LENGTH,
                                message: `The length of title must be more than ${MIN_TITLE_LENGTH} symbols`
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
                                value: MIN_DESCRIPTION_LENGTH,
                                message: `The length of title must be more than ${MIN_DESCRIPTION_LENGTH} symbols`
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
                <MenuItem value = 'Study'> Study </MenuItem>
                <MenuItem value = 'Psychological'> Psychological </MenuItem>
                <MenuItem value = 'Sociological'> Sociological </MenuItem>
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
                                value: MIN_IMAGE_URL_LENGTH,
                                message: `The length of URL must be more than ${MIN_IMAGE_URL_LENGTH} symbols`
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
                        { ...register('timeLimit') }
                    />
                }
                label="Is there a time limit for taking the survey?"
                sx = {{ marginBottom: '20px' }}
            />

            {
                timeLimit 
                ? <TextField 
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
                : null
            }

            <FormControlLabel
                control={
                    <Checkbox
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