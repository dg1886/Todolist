import {FilterValuesType, TodolistType} from '../app/AppWithRedux';
import {v1} from 'uuid';
import {Dispatch} from "redux";
import {todolistsAPI} from "../api/todolist-api";
import {
    RequestStatusType,
    setAppErrorAC,
    setAppErrorActionType,
    setAppStatusAC,
    setAppStatusActionType
} from "./app-reducer";
import {AxiosError} from "axios";

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
export type setTodolistsActionType = ReturnType<typeof setTodolistAC>
export type GetTodolistsActionType = ReturnType<typeof getTodolistAC>
export type changeTodolistEntityStatusActionType = ReturnType<typeof changeTodolistEntityStatusAC>

const initialState:Array<TodolistDomainType> = []
export type TodolistValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
    filter: TodolistValuesType
    entityStatus: RequestStatusType
}

type TodolistsActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | GetTodolistsActionType
    | setTodolistsActionType
    | setAppErrorActionType
    | changeTodolistEntityStatusActionType


export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistsActionsType): Array<TodolistDomainType> => {
    switch (action.type) {

        case 'GET-TODOLIST':
        return action.todolists.map(tl => {
            return {...tl, filter: 'all', entityStatus: 'idle'}
        })

        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id != action.id)

        case 'ADD-TODOLIST': {
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        }

        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        }

        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        }

        case "SET-TODOLISTS": {
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        }

        case "CHANGE-TODOLIST-ENTITY-STATUS": {
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.entityStatus} : tl)    /////////
        }

        default:
            return state
    }
}


// actionCreators:
export const removeTodolistAC = (todolistId: string) => {
    return { type: 'REMOVE-TODOLIST', id: todolistId} as const
}
// export const addTodolistAC = (title: string) => {
//     return { type: 'ADD-TODOLIST', title: title, todolistId: v1()} as const
// }

export const addTodolistAC = (todolist: TodolistType) => {
    return { type: 'ADD-TODOLIST', todolist} as const
}

export const changeTodolistTitleAC = (todolistId: string, title: string) => {
    return { type: 'CHANGE-TODOLIST-TITLE', title: title, id: todolistId} as const
}
export const changeTodolistFilterAC = (filter: FilterValuesType, todolistId: string) => {
    return { type: 'CHANGE-TODOLIST-FILTER', filter: filter, id: todolistId} as const
}

export const getTodolistAC = (todolists: Array<TodolistType>) => {
    return {type: 'GET-TODOLIST', todolists} as const
} ////remove

export const setTodolistAC = (todolists: Array<TodolistType>) => {
    return {type: 'SET-TODOLISTS', todolists} as const
}

export const changeTodolistEntityStatusAC = (id: string, entityStatus: RequestStatusType) => {
    return {type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, entityStatus} as const
}

//thunk:
export const fetchTodolistsTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistAC(res.data))
            dispatch(setAppStatusAC('succeeded'))
        })
}

export const createTodolistTC = (todoTitle: string) => (dispatch: Dispatch<TodolistsActionsType | setAppStatusActionType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.createTodolist(todoTitle)
        .then( (res) => {
            if(res.data.resultCode === 0) {
                const todolist = res.data.data.item
                dispatch(addTodolistAC(todolist))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                if (res.data.messages.length) {
                    dispatch(setAppErrorAC(res.data.messages[0] = 'The length of the title cannot be more than 100 letter'))
                } else {
                    dispatch(setAppErrorAC('error'))
                }
                dispatch(setAppStatusAC('failed'))
            }
        })
        .catch((err: AxiosError) => {
            dispatch(setAppErrorAC(err.message))
            dispatch(setAppStatusAC('failed'))
        })
}

export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch<TodolistsActionsType
    | setAppStatusActionType>) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC(todolistId,'loading'))
    todolistsAPI.removeTodolist(todolistId)
        .then((res) => {
            if(res.data.resultCode === 0) {
                dispatch(removeTodolistAC(todolistId))
                dispatch(setAppStatusAC('succeeded'))
            }
        })

    // dispatch(changeTodolistEntityStatusAC(todolistId,'succeeded'))
}

export const changeTodolistTitleTC = (todolistId: string, todoTitle: string) => (dispatch: Dispatch<TodolistsActionsType
    | setAppStatusActionType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.changeTodolistTitle(todolistId, todoTitle)
        .then( (res) => {
            dispatch(changeTodolistTitleAC(todolistId, todoTitle))
            dispatch(setAppStatusAC('succeeded'))
        })
}
