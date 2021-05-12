import {TasksStateType} from '../app/AppWithRedux';
import {v1} from "uuid";
import {
    AddTodolistActionType,
    GetTodolistsActionType,
    RemoveTodolistActionType,
    setTodolistsActionType
} from "./todolists-reducer";
import {TaskStatuses, TaskType, todolistsAPI, UpdateTaskDomainModelType} from "../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";


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
                return { ...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
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
                    .map( t => t.id === action.taskId ? {...t, ...action.domainModel} : t)
        }
        case 'CHANGE_TITLE_STATUS': {
            let todolistTasks = state[action.todolistId]
            state[action.todolistId] = todolistTasks
                .map( t => t.id === action.taskId ? {...t, title: action.title} : t)
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
            action.todolists.forEach( tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'SET_TASKS': {
            return {...state, [action.todolistId]: action.tasks}
            // const stateCopy = {...state}
            // stateCopy[action.todolistId] = action.tasks
            // return stateCopy
        }

        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string) => {
    return { type: 'REMOVE_TASK', taskId, todolistId} as const
}
export const addTaskAC = (task: TaskType) => {
    return { type: 'ADD_TASK', task} as const
}
export const changeTaskStatusAC = (taskId: string, domainModel: UpdateTaskDomainModelType, todolistId: string) => {
    return { type: 'CHANGE_TASK_STATUS', taskId, domainModel, todolistId} as const
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => {
    return { type: 'CHANGE_TITLE_STATUS', taskId, title, todolistId} as const
}

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => {
    return {type: 'SET_TASKS', tasks, todolistId} as const
}

export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<TasksActionsType>) => {
    todolistsAPI.getTasks(todolistId)
        .then((res)=> {
        const tasks = res.data.items
            dispatch(setTasksAC(tasks, todolistId))
    })
}

export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<TasksActionsType>) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then( (res) => {
        dispatch(removeTaskAC(todolistId, taskId))
        })
}

export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch<TasksActionsType>) => {
    todolistsAPI.createTask(todolistId, title)
        .then((res)=> {
            const task = res.data.data.item
            dispatch(addTaskAC(task))
        })
}

export const changeTaskTitleTC = (taskId: string, taskTitle: string, todolistId: string) => (dispatch: Dispatch<TasksActionsType>) => {
        todolistsAPI.changeTaskTitle(taskId, taskTitle, todolistId)
            .then( (res) => {
                dispatch(changeTaskTitleAC(taskId, taskTitle, todolistId))
            })
}

export const changeTaskStatusTC = (taskId: string, domainModel: UpdateTaskDomainModelType, todolistId: string) =>
    (dispatch: Dispatch<TasksActionsType>, getState: () => AppRootStateType ) => {
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

            todolistsAPI.changeTaskStatus(taskId, apiModel, todolistId)
                .then(res => {
                    if (res.data.resultCode === 0) {
                        const action = changeTaskStatusAC(taskId, domainModel, todolistId)
                        dispatch(action)
                    }
                })
        }
    }





