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
export type GetTasksResponce = {
    item: TaskType[]
    error: string | null
    totalCount: number
}

export const todolistsAPI = {
    getTodolists() {
        const promise = instance.get<TodolistsType[]>('todo-lists')
        return promise
    },
    getTasks(todolistId: string) {
        const promise = instance.get<GetTasksResponce>(`todo-lists/${todolistId}/tasks`)
        return promise
    }
}