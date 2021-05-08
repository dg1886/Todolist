import {FilterValuesType, TodolistType} from '../AppWithRedux';
import {v1} from 'uuid';
import {Dispatch} from "redux";
import {todolistsAPI} from "../api/todolist-api";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST'
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST'
    title: string
    todolistId: string
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE'
    id: string
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER'
    id: string
    filter: FilterValuesType
}

export type setTodolistsActionType = {
    type: 'SET-TODOLISTS'
    todolists: Array<TodolistType>
}

export type GetTodolistsActionType = ReturnType<typeof getTodolistAC>

type TodolistsActionsType = RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | GetTodolistsActionType
    | setTodolistsActionType

const initialState:Array<TodolistDomainType> = []
export type TodolistValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {filter: TodolistValuesType}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistsActionsType): Array<TodolistDomainType> => {
    switch (action.type) {

        case 'GET-TODOLIST':
        return action.todolists.map(tl => {
            return {...tl, filter: 'all'}
        })

        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id != action.id)

        case 'ADD-TODOLIST': {
            return [{
                id: action.todolistId,
                title: action.title,
                filter: 'all',
                addedDate: '',
                order: 0
            }, ...state]
        }

        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                todolist.title = action.title;
            }
            return [...state]
        }

        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                todolist.filter = action.filter;
            }
            return [...state];
        }

        case "SET-TODOLISTS": {
            return action.todolists.map(tl => {
               return {
                   ...tl,
                   filter: 'all'
               }
            })
        }

        default:
            return state
    }
}

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return { type: 'REMOVE-TODOLIST', id: todolistId}
}
export const addTodolistAC = (title: string): AddTodolistActionType => {
    return { type: 'ADD-TODOLIST', title: title, todolistId: v1()}
}
export const changeTodolistTitleAC = (todolistId: string, title: string): ChangeTodolistTitleActionType => {
    return { type: 'CHANGE-TODOLIST-TITLE', title: title, id: todolistId}
}
export const changeTodolistFilterAC = (filter: FilterValuesType, todolistId: string): ChangeTodolistFilterActionType => {
    return { type: 'CHANGE-TODOLIST-FILTER', filter: filter, id: todolistId}
}

export const getTodolistAC = (todolists: Array<TodolistType>) => {
    return {type: 'GET-TODOLIST', todolists} as const
}

export const setTodolistAC = (todolists: Array<TodolistType>): setTodolistsActionType => {
    return {type: 'SET-TODOLISTS', todolists}
}

export const fetchTodolistsTC = () => (dispatch: Dispatch<TodolistsActionsType>) => {
    todolistsAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistAC(res.data))
        })
}

export const createTodolistTC = (todoTitle: string) => (dispatch: Dispatch) => {
    todolistsAPI.createTodolist(todoTitle)
        .then( (res) => {
            dispatch(addTodolistAC(todoTitle))
        })

}

export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    todolistsAPI.removeTodolist(todolistId)
    dispatch(removeTodolistAC(todolistId))
}

export const changeTodolistTitleTC = (todolistId: string, todoTitle: string) => (dispatch: Dispatch) => {
    todolistsAPI.changeTodolistTitle(todolistId, todoTitle)
        .then( (res) => {
            dispatch(changeTodolistTitleAC(todolistId, todoTitle))
        })
}
