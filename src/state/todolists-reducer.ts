import {FilterValuesType, TodolistType} from '../app/AppWithRedux';
import {v1} from 'uuid';
import {Dispatch} from "redux";
import {todolistsAPI} from "../api/todolist-api";

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
export type setTodolistsActionType = ReturnType<typeof setTodolistAC>
export type GetTodolistsActionType = ReturnType<typeof getTodolistAC>

const initialState:Array<TodolistDomainType> = []
export type TodolistValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {filter: TodolistValuesType}

type TodolistsActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | GetTodolistsActionType
    | setTodolistsActionType

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistsActionsType): Array<TodolistDomainType> => {
    switch (action.type) {

        case 'GET-TODOLIST':
        return action.todolists.map(tl => {
            return {...tl, filter: 'all'}
        })

        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id != action.id)

        case 'ADD-TODOLIST': {
            return [{...action.todolist, filter: 'all'}, ...state]
        }

        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        }

        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        }

        case "SET-TODOLISTS": {
            return action.todolists.map(tl => ({...tl, filter: 'all'}))
        }

        default:
            return state
    }
}

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
}

export const setTodolistAC = (todolists: Array<TodolistType>) => {
    return {type: 'SET-TODOLISTS', todolists} as const
}

export const fetchTodolistsTC = () => (dispatch: Dispatch<TodolistsActionsType>) => {
    todolistsAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistAC(res.data))
        })
}

export const createTodolistTC = (todoTitle: string) => (dispatch: Dispatch<TodolistsActionsType>) => {
    todolistsAPI.createTodolist(todoTitle)
        .then( (res) => {
            const todolist = res.data.data.item
            dispatch(addTodolistAC(todolist))
        })

}

export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch<TodolistsActionsType>) => {
    todolistsAPI.removeTodolist(todolistId)
    dispatch(removeTodolistAC(todolistId))
}

export const changeTodolistTitleTC = (todolistId: string, todoTitle: string) => (dispatch: Dispatch<TodolistsActionsType>) => {
    todolistsAPI.changeTodolistTitle(todolistId, todoTitle)
        .then( (res) => {
            dispatch(changeTodolistTitleAC(todolistId, todoTitle))
        })
}
