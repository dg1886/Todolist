import {TasksStateType} from '../App';
import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType} from "./todolists-reducer";

export type removeTaskActionType = {
    type: 'REMOVE_TASK'
    taskId: string
    todolistId: string
}
export type addTaskActionType = {
    type: 'ADD_TASK'
    title: string
    todolistId: string
}
export type changeTaskStatusActionType = {
    type: 'CHANGE_TASK_STATUS'
    taskId: string
    isDone: boolean
    todolistId: string
}
export type changeTitleStatusActionType = {
    type: 'CHANGE_TITLE_STATUS'
    taskId: string
    title: string
    todolistId: string
}

type ActionsType = removeTaskActionType
    | addTaskActionType
    | changeTaskStatusActionType
    | changeTitleStatusActionType
    | AddTodolistActionType
    | RemoveTodolistActionType

export const REMOVE_TASK = 'REMOVE-TASK';
export const ADD_TASK = 'ADD-TASK';
export const CHANGE_TASK_STATUS = 'CHANGE-TASK-STATUS';
export const CHANGE_TITLE_STATUS = 'CHANGE-TITLE-STATUS'

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType) => {
    switch (action.type) {
        case 'REMOVE_TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId]
            stateCopy[action.todolistId] = tasks.filter(t => t.id !== action.taskId)
            return stateCopy
        }
            case 'ADD_TASK': {
                const stateCopy = {...state}
                const tasks = stateCopy[action.todolistId]
                const newTask = {id: v1(), title: action.title, isDone: false}
                const newTasks = [newTask, ...tasks]
                stateCopy[action.todolistId] = newTasks
                return stateCopy
            }
        case 'CHANGE_TASK_STATUS': {
            let todolistTasks = state[action.todolistId]
            state[action.todolistId] = todolistTasks.map(
                t => t.id === action.taskId
                    ? {...t, isDone: action.isDone}
                    : t)
            state[action.todolistId] = [...todolistTasks]
            return ({...state})
        }
        case 'CHANGE_TITLE_STATUS': {
            let todolistTasks = state[action.todolistId]
            state[action.todolistId] = todolistTasks.map(
                t => t.id === action.taskId
                ? {...t, title: action.title}
                : t
            )
            state[action.todolistId] = [...todolistTasks]
            return ({...state})
        }
        case 'ADD-TODOLIST': {
            const stateCopy = {...state}
            stateCopy[action.todolistId] = []

            return stateCopy
        }
        case 'REMOVE-TODOLIST': {
            const stateCopy = {...state}
            delete stateCopy[action.id]

            return stateCopy
        }

        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): removeTaskActionType => {
    return { type: 'REMOVE_TASK', taskId, todolistId}
}
export const addTaskAC = (title: string, todolistId: string): addTaskActionType => {
    return { type: 'ADD_TASK', title, todolistId}
}
export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string): changeTaskStatusActionType => {
    return { type: 'CHANGE_TASK_STATUS', taskId, isDone, todolistId}
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): changeTitleStatusActionType => {
    return { type: 'CHANGE_TITLE_STATUS', taskId, title, todolistId}
}

