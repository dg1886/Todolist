import React, {useEffect} from 'react';
import './App.css';
import {TaskType} from '../api/todolist-api'
import {
    AppBar,
    Button, CircularProgress,
    Container,
    Grid,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {TodolistsList} from '../features/TodolistsList/TodolistList'
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../state/store";
import {initializeAppTC, RequestStatusType} from "../state/app-reducer";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {TodolistValuesType} from "../state/todolists-reducer";
import {Login} from "../features/Login/Login";
import {Route, Switch, Redirect} from "react-router-dom"

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}


function AppWithRedux() {
    const dispatch = useDispatch()

    useEffect( () => {
        dispatch(initializeAppTC())
    }, [])

    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized)

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }


    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        Todolist
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>

                {/*<LinearProgress/>*/}
                {status === 'loading' && <LinearProgress/>}
            </AppBar>

            <Container fixed>
               <Switch>
                <Route exact path={'/'} render={() => <TodolistsList/>}/>
                <Route path={'/login'} render={() => <Login/>}/>
                <Route path={'/404'} render={() => <h1 style={{ color: 'red' }}>404: PAGE NOT FOUND</h1>}/>
                <Redirect from={'*'} to={'/404'}/>
                <Login/>
               </Switch>
            </Container>

            <ErrorSnackbar/>
        </div>
    );
}

export default AppWithRedux;
