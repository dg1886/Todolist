import {TasksStateType} from '../AppWithRedux';
import {v1} from "uuid";
import {
    AddTodolistActionType,
    GetTodolistsActionType,
    RemoveTodolistActionType,
    setTodolistsActionType
} from "./todolists-reducer";
import {TaskType} from "../api/todolist-api";
import {Dispatch} from "redux";
import {todolistsAPI} from "../api/todolist-api";


export type removeTaskActionType = ReturnType<typeof removeTaskAC>
export type addTaskActionType = ReturnType<typeof addTaskAC>
export type changeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
export type changeTitleStatusActionType = ReturnType<typeof changeTaskTitleAC>
export type SetTasksActionType = ReturnType<typeof setTasksAC>

type TasksActionsType = removeTaskActionType
    | addTaskActionType
    | changeTaskStatusActionType
    | changeTitleStatusActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | GetTodolistsActionType
    | setTodolistsActionType
    | SetTasksActionType

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: TasksActionsType): TasksStateType => {
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
            state[action.todolistId] = todolistTasks
                .map(t => t.id === action.taskId ? {...t, isDone: action.isDone} : t)
            return ({...state})
        }
        case 'CHANGE_TITLE_STATUS': {
            let todolistTasks = state[action.todolistId]
            state[action.todolistId] = todolistTasks
                .map( t => t.id === action.taskId ? {...t, title: action.title} : t)
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
        case 'GET-TODOLIST': {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }

        case 'SET-TODOLISTS': {
            const copyState = {...state}
            action.todolists.forEach( tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'SET_TASKS': {
            const stateCopy = {...state}
            stateCopy[action.todolistId]
        }

        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string) => {
    return { type: 'REMOVE_TASK', taskId, todolistId} as const
}
export const addTaskAC = (title: string, todolistId: string) => {
    return { type: 'ADD_TASK', title, todolistId} as const
}
export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string) => {
    return { type: 'CHANGE_TASK_STATUS', taskId, isDone, todolistId} as const
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => {
    return { type: 'CHANGE_TITLE_STATUS', taskId, title, todolistId} as const
}

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => {
    return {type: 'SET_TASKS', tasks, todolistId} as const
}

export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    todolistsAPI.getTasks(todolistId)
        .then((res)=> {
        const tasks = res.data.item
            dispatch(setTasksAC(tasks, todolistId))
    })
}





