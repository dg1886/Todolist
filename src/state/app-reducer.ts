import {setIsLoggedInAC, setIsLoggedInActionType} from "./auth-reducer";
import {authAPI} from "../api/todolist-api";
import {Dispatch} from "redux";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {AxiosError} from "axios";


export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}
export type AppReducerActionType =
    | setAppStatusActionType
    | setAppErrorActionType
    | setIsLoggedInActionType
    | setIsInitializedActionType

const initialState: InitialStateType = {
    status: 'idle',
    error: null as string | null,
    isInitialized: false
}

export const appReducer = (state: InitialStateType = initialState, action: AppReducerActionType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS': {
            return {...state, status: action.status}
        }
        case 'APP/SET-ERROR': {
            return {...state, error: action.error}
        }
        case "APP/SET-INITIALIZED-APP": {
            return {...state, isInitialized: action.isInitialized}
        }
        default: return state
    }

}

export const setAppStatusAC = (status: RequestStatusType) => {
    return {type: 'APP/SET-STATUS', status} as const
}

export const setAppErrorAC = (error: string | null) => {
    return {type: 'APP/SET-ERROR', error} as const
}

export const  setIsInitializedAC = (isInitialized: boolean) => {
    return {type: 'APP/SET-INITIALIZED-APP', isInitialized} as const
}

export const initializeAppTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.authMe().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    })
        .catch((err: AxiosError) => {
            handleServerNetworkError(err, dispatch)
        })
        .finally( () => {
            dispatch(setIsInitializedAC(true))
        })
}

export type setAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type setAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type setIsInitializedActionType = ReturnType<typeof setIsInitializedAC>