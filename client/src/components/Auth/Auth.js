import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Container, Paper, Typography, Grid, Button, Avatar, TextField } from '@material-ui/core';
import { GoogleLogin } from 'react-google-login';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { AUTH } from '../../constants/actionTypes';
import { signIn, signUp } from '../../actions/auth';
import Input from './Input';
import Icon from './Icon';


import useStyles from './styles';


const Auth = () => {
    const initialState = { firstname: '', lastname: '', email: '', password: '', confirmPassword: '' };

    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const [isSignUp, setIsSignUp] = useState(false);
    const handleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword)
    }
    const switchMode = () => {
        setFormData(initialState);
        setIsSignUp((prevIsSignUp) => !prevIsSignUp);
        setShowPassword(false);
    }
    const googleSuccess = (res) => {
        console.log(res);
        const result = res?.profileObj;
        const token = res?.tokenId;
        try {
            history.push('/');//to redirect to home after logging in 
            dispatch({ type: AUTH, data: { result, token } });

        } catch (error) {
            console.log(error);
        }

    }
    const googleFailure = (error) => {
        alert('Google Sign In was unsuccessful. Try again later');
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        if (isSignUp)
            dispatch(signUp(formData, history));
        else
            dispatch(signIn(formData, history));
    }
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    };
    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5">{isSignUp ? 'Sign Up' : 'Sign In'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {
                            isSignUp && (
                                <>
                                    <Input name="firstname" label="First name" handleChange={handleChange} autoFocus half />
                                    <Input name="lastname" label="Lastname" handleChange={handleChange} half />
                                </>
                            )
                        }
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                        {isSignUp && <Input name="confirmPassword" label="Repeat Password" type="password" handleChange={handleChange} />}
                    </Grid>

                    <Button fullWidth type="submit" variant="contained" color="primary" className={classes.submit}>{isSignUp ? 'Sign Up' : 'Sign In'}</Button>
                    <GoogleLogin
                        clientId="511300593679-lue6cvn7scmo8qbok2cu2ihtn6maqqri.apps.googleusercontent.com"
                        render={(renderProps) => (
                            <Button className={classes.googleButton} fullWidth variant="contained" color="primary" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                                Google Sign In
                            </Button>)
                        }
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                        cookiePolicy="single_host_origin" />
                    <Grid container justify="flex-end">
                        <Grid type="item">
                            <Button onClick={switchMode}>
                                {isSignUp ? 'Already have an account?Sign In' : "Don't have an account ?Sign up"}
                            </Button>
                        </Grid>

                    </Grid>
                </form>
            </Paper>

        </Container >
    )

}

export default Auth;