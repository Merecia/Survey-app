import React, { FC } from 'react';
import style from './SurveyConstructForm.module.scss';
import { useForm } from 'react-hook-form';
import { updateSurveyInfo } from '../../../store/action-creators/survey';
import { Category, ISurveyInfo } from '../../../types/survey';

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
            category: 'Study',
            description: '',
            imageUrl: '',
            timeLimit: false,
            maximumPassingTimeSeconds: 600,
            isEvaluated: true
        }
    });

    const MIN_TITLE_LENGTH = 4;
    const MIN_DESCRIPTION_LENGTH = 4;
    const MIN_IMAGE_URL_LENGTH = 6;

    const timeLimit = watch('timeLimit');

    const onSubmit = handleSubmit(async (data) => {
        const surveys = localStorage.getItem('surveys');

        let id;
        if (surveys) id = JSON.parse(surveys).pop().surveyInfo.id + 1;  
        else id = 1;

        const surveyInfo: ISurveyInfo = {
            id: id,
            title: data.title,
            category: data.category as Category,
            description: data.description,
            imageUrl: data.imageUrl,
            isEvaluated: true
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
            <p> Enter the title of the survey: </p>
            <input
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
            />
            <p> {errors.title?.message} </p>

            <p> Enter the description of the survey: </p>
            <textarea
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
            />
            <p> {errors.description?.message} </p>

            <p> Select category of survey from the list: </p>
            <select
                { ...register('category', { required: 'Choose category' } ) }
            >
                <option value="Study"> Study </option>
                <option value="Psychological"> Psychological </option>
                <option value="Sociological"> Sociological </option>
            </select>
            <input
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
                placeholder="Enter the image URL to the survey"
            />
            <p> {errors.imageUrl?.message} </p>

            <div className = {style.TimeLimit}>
                <input 
                    type = 'checkbox'
                    id = 'timeLimit'
                    { ...register('timeLimit') }
                />
                <label htmlFor="timeLimit"> Is there a time limit for taking the survey? </label>
                { 
                    timeLimit 
                    ? <>
                        <p> Enter the maximum time of passing the survey in seconds </p>
                        <input 
                            { 
                                ...register('maximumPassingTimeSeconds', { 
                                    required: 'You indicated that a time limit must be present, but you did not specify how much',
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: 'Please enter a positive integer number',
                                    }
                                }) 
                            }
                        />
                        <p> {errors.maximumPassingTimeSeconds?.message} </p>
                    </> 
                    : null
                }
            </div>
            
            <input 
                type = 'checkbox'
                id = 'isEvaluated'
                { ...register('isEvaluated') }
            />
            <label htmlFor="isEvaluated"> Will the questions be graded? </label>

            <input 
                type="submit" 
                value = "Go to create questions"
            />
        </form>
    )
}

export default SurveyConstructForm;