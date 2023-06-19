import React, { FC, useState } from 'react';
import style from './Auth.module.scss';
import { useForm } from 'react-hook-form';
import { TextField, Button, Typography } from '@mui/material';
import { Snackbar, Alert } from '@mui/material';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase';
import {useNavigate} from 'react-router-dom';

const Auth: FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    const [signUp, setSignUp] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorAlert, setErrorAlert] = useState<string>('');
    const navigate = useNavigate();

    const renderErrorAlert = (message: string) => (
        <Snackbar
            open={showErrorAlert}
            autoHideDuration={6000}
            onClose={() => setShowErrorAlert(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert onClose={() => setShowErrorAlert(false)} severity="error">
                {message}
            </Alert>
        </Snackbar>
    )

    const red = '#dc3545';
    const blue = '#1877f2';

    const renderSignInLabel = () => {
        return (
            <>
                <Typography 
                    variant={"h6"} 
                    component={"h6"} 
                    fontWeight={'300'}
                    sx = {{ marginRight: '15px' }}
                >
                    Already have an account?
                </Typography>
                <Typography 
                    color={red} 
                    variant={'h6'} 
                    fontWeight={'300'}
                    paragraph 
                    component={'span'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSignUp(false)}
                >
                    Sign in
                </Typography>
            </>
        );
    }

    const renderFullNameFields = () => {
        return (
            <div className = {style.NameFields}>
                <TextField
                    placeholder="Enter a first name"
                    autoComplete={'off'}
                    size='small'
                    { ...register('firstName', { required: "First name is required" }) }
                    sx={{ width: '48%' }}
                    error={errors.firstName?.message !== undefined}
                    helperText={errors.firstName?.message}
                />
                <TextField
                    placeholder="Enter a last name"
                    autoComplete={'off'}
                    size='small'
                    { ...register('lastName', { required: "Last name is required" }) }
                    sx={{ width: '48%' }}
                    error={errors.lastName?.message !== undefined}
                    helperText={errors.lastName?.message}
                />
            </div>
        );
    }

    const renderSignUpLabel = () => {
        return (
            <>
                <Typography 
                    variant={'h6'} 
                    component={'h6'} 
                    fontWeight={'300'} 
                    sx = {{ marginRight: '15px' }}
                >
                    Don't have an account?
                </Typography>
                <Typography 
                    color={blue} 
                    variant={'h6'} 
                    fontWeight={'300'}
                    paragraph 
                    component={'span'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSignUp(true)}
                >
                    Sign up
                </Typography>
            </>
        )
    }

    const handleAuth = handleSubmit(async ({
        firstName,
        lastName,
        email,
        password,
        confirmPassword
    }) => {
        if (signUp) {
            if (password !== confirmPassword) {
                setShowErrorAlert(true);
                setErrorAlert(`Passwords don't match`);
                return;
            }
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log(user);
                    updateProfile(user, {displayName: `${firstName} ${lastName}`});
                    navigate('/');
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    setShowErrorAlert(true);
                    setErrorAlert(errorMessage);
                });
        } else {
            signInWithEmailAndPassword(auth, email, password)
                .then(userCredential => {
                    const user = userCredential.user;
                    console.log(user);
                    navigate('/');
                })
                .catch(error => {
                    const errorMessage = error.message;
                    setShowErrorAlert(true);
                    setErrorAlert(errorMessage);
                })
        }
    })

    return (
        <form
            className={style.AuthForm}
            onSubmit={handleAuth}
        >
            {showErrorAlert && renderErrorAlert(errorAlert)}

            <Typography 
                variant={'h5'} 
                component={'h5'} 
                textAlign = {'center'}
                fontWeight={'300'} 
                sx = {{ marginBottom: '40px' }}
            >
                { signUp ? 'Create a new account' : 'Login to your account'}
            </Typography>

            { signUp && renderFullNameFields() }

            <TextField
                placeholder="Enter an email"
                size='small'
                fullWidth
                {
                    ...register(
                        'email', {
                            required: "Email is required",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Entered value does not match email format",
                            }
                        }
                    )
                }
                sx={{ marginBottom: '20px' }}
                error={errors.email?.message !== undefined}
                helperText={errors.email?.message}
            />

            <TextField
                placeholder='Enter a password'
                size='small'
                type={'password'}
                fullWidth
                {
                    ...register(
                        'password',
                        { required: 'Password is required' }
                    )
                }
                sx={{ marginBottom: '20px' }}
                error={errors.password?.message !== undefined}
                helperText={errors.password?.message}
            />

            {
                signUp && 
                <TextField
                    placeholder='Confirm password'
                    size='small'
                    type={'password'}
                    fullWidth
                    {
                        ...register(
                            'confirmPassword',
                            { required: 'Please enter your password again' }
                        )
                    }
                    sx={{ marginBottom: '20px' }}
                    error={errors.confirmPassword?.message !== undefined}
                    helperText={errors.confirmPassword?.message}
                />
            }

            <Button 
                variant='contained' 
                style = {{backgroundColor: signUp ? red : blue}}
                type='submit' 
                fullWidth
                sx={{ marginBottom: '20px' }}
            >
                {signUp ? 'Sign Up' : 'Sign In'}
            </Button>
            
            <div className = {style.BottomLabel}>
                { signUp ? renderSignInLabel() : renderSignUpLabel() }
            </div>
        </form>
    );
}

export default Auth;