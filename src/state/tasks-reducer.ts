import {TasksStateType} from '../app/AppWithRedux';
import {
    AddTodolistActionType,
    GetTodolistsActionType,
    RemoveTodolistActionType,
    setTodolistsActionType
} from "./todolists-reducer";
import {RequestStatusType, setAppErrorAC, setAppErrorActionType, setAppStatusActionType} from '../state/app-reducer'
import {TaskType, todolistsAPI, UpdateTaskDomainModelType} from "../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";
import {setAppStatusAC} from "./app-reducer";
import {AxiosError} from "axios";


export type removeTaskActionType = ReturnType<typeof removeTaskAC>
export type addTaskActionType = ReturnType<typeof addTaskAC>
export type changeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
export type changeTitleStatusActionType = ReturnType<typeof changeTaskTitleAC>
export type SetTasksActionType = ReturnType<typeof setTasksAC>
export type changeTaskEntityStatusActionType = ReturnType<typeof changeTaskEntityStatusAC>

type TasksActionsType = removeTaskActionType
    | addTaskActionType
    | changeTaskStatusActionType
    | changeTitleStatusActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | GetTodolistsActionType
    | setTodolistsActionType
    | SetTasksActionType
    | setAppErrorActionType
    | changeTaskEntityStatusActionType


const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE_TASK': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(tl => tl.id !== action.taskId)
            }

            // const stateCopy = {...state}
            // const tasks = stateCopy[action.todolistId]
            // stateCopy[action.todolistId] = tasks.filter(t => t.id !== action.taskId)
            // return stateCopy
        }
        case 'ADD_TASK': {
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
            // const stateCopy = {...state}
            // const tasks = stateCopy[action.task.todoListId]
            // const newTask = [action.task, ...tasks]
            // stateCopy[action.task.todoListId] = newTask
            // return stateCopy;
        }
        case 'CHANGE_TASK_STATUS':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.domainModel} : t)
            }
        case 'CHANGE_TITLE_STATUS': {
            let todolistTasks = state[action.todolistId]
            state[action.todolistId] = todolistTasks
                .map(t => t.id === action.taskId ? {...t, title: action.title} : t)
            return ({...state})
        }
        case 'ADD-TODOLIST': {
            return {...state, [action.todolist.id]: []}
            // const stateCopy = {...state}
            // stateCopy[action.todolistId] = []
            // return stateCopy
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
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'SET_TASKS': {
            return {...state, [action.todolistId]: action.tasks.map(t=>({...t, entityStatus: 'idle'}))/*, entityStatus: 'idle'*/}
            // const stateCopy = {...state}
            // stateCopy[action.todolistId] = action.tasks
            // return stateCopy
        }
        case "CHANGE-TASK-ENTITY-STATUS": {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, entityStatus: action.entityStatus} : t)
            }
        }

        default:
            return state
    }
}
//actionCreators:
export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {type: 'REMOVE_TASK', taskId, todolistId} as const
}
export const addTaskAC = (task: TaskType) => {
    return {type: 'ADD_TASK', task} as const
}
export const changeTaskStatusAC = (taskId: string, domainModel: UpdateTaskDomainModelType, todolistId: string) => {
    return {type: 'CHANGE_TASK_STATUS', taskId, domainModel, todolistId} as const
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => {
    return {type: 'CHANGE_TITLE_STATUS', taskId, title, todolistId} as const
}

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => {
    return {type: 'SET_TASKS', tasks, todolistId} as const
}
export const changeTaskEntityStatusAC = (taskId: string, todolistId: string, entityStatus: RequestStatusType) => {
    debugger
    return {type: 'CHANGE-TASK-ENTITY-STATUS', taskId, todolistId, entityStatus} as const
}


//thunk:
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<TasksActionsType | setAppStatusActionType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            const tasks = res.data.items
            dispatch(setTasksAC(tasks, todolistId))
            dispatch(setAppStatusAC('succeeded'))
        })
}

export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch<TasksActionsType | setAppStatusActionType>) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTaskEntityStatusAC(taskId, todolistId, 'loading'))
    todolistsAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            dispatch(removeTaskAC(taskId, todolistId))
            dispatch(setAppStatusAC('succeeded'))
        })
}

export const addTaskTC = (title: string, todolistId: string) =>
    (dispatch: Dispatch<TasksActionsType | setAppStatusActionType>) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.createTask(todolistId, title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    const task = res.data.data.item
                    dispatch(addTaskAC(task))
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    if (res.data.messages.length) {
                        dispatch(setAppErrorAC(res.data.messages[0] = 'The length of the title cannot be more than 100 letter'))
                    } else {
                        dispatch(setAppErrorAC('Some error occurred'))
                    }
                    dispatch(setAppStatusAC('failed'))
                }
            })
            .catch((err: AxiosError) => {
                dispatch(setAppErrorAC(err.message))
                dispatch(setAppStatusAC('failed'))
            })
    }

export const changeTaskTitleTC = (taskId: string, taskTitle: string, todolistId: string) =>
    (dispatch: Dispatch<TasksActionsType | setAppStatusActionType>) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.changeTaskTitle(taskId, taskTitle, todolistId)
            .then((res) => {
                    if (res.data.resultCode === 0) {
                        dispatch(changeTaskTitleAC(taskId, taskTitle, todolistId))
                        dispatch(setAppStatusAC('succeeded'))
                    } else {
                        if (res.data.messages.length) {
                            dispatch(setAppErrorAC(res.data.messages[0] = 'The length of the title cannot be more than 100 letter'))
                        } else {
                            dispatch(setAppErrorAC('Some error occurred'))
                        }
                        dispatch(setAppStatusAC('failed'))
                    }
                }
            )
            .catch((err: AxiosError) => {
                dispatch(setAppErrorAC(err.message))
                dispatch(setAppStatusAC('failed'))
                // if (taskTitle.length > 100) {
                //     dispatch(setAppErrorAC(err.message))
                //     dispatch(setAppStatusAC('failed'))
                // }
            })
    }

export const changeTaskStatusTC = (taskId: string, domainModel: UpdateTaskDomainModelType, todolistId: string) =>
    (dispatch: Dispatch<TasksActionsType | setAppStatusActionType>, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            alert('task not found in state')
        }
        if (task) {
            const apiModel: UpdateTaskDomainModelType = {
                deadline: task.deadline,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,
                title: task.title,
                status: domainModel.status,
                ...domainModel
            }

            dispatch(setAppStatusAC('loading'))
            todolistsAPI.changeTaskStatus(taskId, apiModel, todolistId)
                .then(res => {
                    if (res.data.resultCode === 0) {
                        const action = changeTaskStatusAC(taskId, domainModel, todolistId)
                        dispatch(action)
                        dispatch(setAppStatusAC('succeeded'))
                    }
                })
        }
    }





