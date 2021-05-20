import {setAppErrorAC, setAppErrorActionType, setAppStatusAC, setAppStatusActionType} from '../state/app-reducer'
import {ResponceType} from '../api/todolist-api'
import {Dispatch} from 'redux'

export const handleServerAppError = <D>(data: ResponceType<D>, dispatch: Dispatch<setAppErrorActionType | setAppStatusActionType>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch<setAppErrorActionType | setAppStatusActionType>) => {
    dispatch(setAppErrorAC(error.message ? error.message : 'Some error occurred'))
    dispatch(setAppStatusAC('failed'))
}