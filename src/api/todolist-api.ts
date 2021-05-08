import axios from "axios";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '86f9a91e-2262-457f-972b-f0bb39472774'
    }
})

type TodolistsType = {
    id: string
    title: string
    order: number
    addedDate: string
}
export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}
export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
export type GetTasksResponceType = {
    items: TaskType[]
    error: string | null
    totalCount: number
}
export type ResponceType<D = {}> = {
    messages: string[]
    resultCode: number
    data: D
}

export type UpdateTaskDomainModelType = {
    title?: string
    description?: string
    completed?: boolean
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string

}

export const todolistsAPI = {
    getTodolists() {
        const promise = instance.get<TodolistsType[]>('todo-lists')
        return promise
    },

    createTodolist(todolistTitle: string) {
        const promise = instance.post<ResponceType<{item: TodolistsType}>>(`todo-lists`, {title: todolistTitle})
        return promise
    },

    removeTodolist(todolistId: string) {
        const promise = instance.delete<ResponceType>(`todo-lists/${todolistId}`)
        return promise
    },

    changeTodolistTitle(todolistId: string, todoTitle: string) {
        const promise = instance.put<ResponceType<TodolistsType>>(`todo-lists/${todolistId}`, {title: todoTitle})
        return promise
    },

    getTasks(todolistId: string) {
        const promise = instance.get<GetTasksResponceType>(`todo-lists/${todolistId}/tasks`)
        return promise
    },

    createTask(todolistId: string, taskTitle: string) {
        const promise = instance.post<ResponceType <{item: TaskType}>>(`todo-lists/${todolistId}/tasks`, {title: taskTitle})
        return promise
    },

    deleteTask(todolistId: string, taskId: string) {
        const promise = instance.delete<ResponceType>(`todo-lists/${todolistId}/tasks/${taskId}`)
        return promise
    },

    changeTaskStatus(taskId: string, model: UpdateTaskDomainModelType, todolistId: string ) {
        const promise = instance.put<ResponceType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model )
        return promise
    },
    changeTaskTitle(taskId: string, taskTitle: string, todolistId: string) {
        const promise = instance.put<ResponceType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, {title: taskTitle})
        return promise
    },

}