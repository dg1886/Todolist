import React from 'react'
import {Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, TextField, Button, Grid} from '@material-ui/core'
import {Form, useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {loginTC} from "../../state/auth-reducer";
import {AppRootStateType} from "../../state/store";
import {Redirect} from "react-router-dom";

type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}


export const Login = () => {
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const dispatch = useDispatch()
    const loginForm = useFormik( {
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate: (values) => {
            const errors: FormikErrorType = {};
            if (!values.email) {
                errors.email = 'Field is required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }
            if(!values.password.length) {
                errors.password = 'Field is required'
            } else if (values.password.length < 3) {
                errors.password = 'Password is at least 3 characters long'
            }
            return errors;
        },
        onSubmit: (data: any) => {
            // alert(JSON.stringify(values))
            dispatch(loginTC(data))
            loginForm.resetForm()
        }
    } )

    if(isLoggedIn) {
        return <Redirect to={'/'}/>
    }

    return <Grid container justify="center">
        <Grid item xs={4}>
            <FormControl>
                <FormLabel>
                    <p>To log in get registered
                        <a href={'https://social-network.samuraijs.com/'}
                           target={'_blank'}>here
                        </a>
                    </p>
                    <p>or use common test account credentials:</p>
                    <p>Email: free@samuraijs.com</p>
                    <p>Password: free</p>
                </FormLabel>
                <form onSubmit={loginForm.handleSubmit}>
                <FormGroup>
                    <TextField
                        label='Email'
                        margin='normal'
                        name='email'
                        type='email'
                        onBlur={loginForm.handleBlur}
                        onChange={loginForm.handleChange}
                        value={loginForm.values.email}
                    />
                    {loginForm.touched.email && loginForm.errors.email ? <div style={{color: 'red'}}>{loginForm.errors.email}</div> : null}
                    <TextField
                        label='Password'
                        margin='normal'
                        type='password'
                        name='password'
                        onBlur={loginForm.handleBlur}
                        onChange={loginForm.handleChange}
                        value={loginForm.values.password}
                    />
                    {loginForm.touched.password && loginForm.errors.password ? <div style={{color: 'red'}}>{loginForm.errors.password}</div> : null}
                    <FormControlLabel
                        label={'Remember me'}
                        control={<Checkbox name='rememberMe'
                                           onChange={loginForm.handleChange}
                                           checked={loginForm.values.rememberMe}
                        />}
                    />
                    <Button type={'submit'} variant={'contained'} color={'primary'}>Login</Button>
                </FormGroup>
                </form>
            </FormControl>
        </Grid>
    </Grid>
}
