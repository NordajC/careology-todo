export interface UpdateTaskInput {
    title?: string
    dueDate?: string
    tag?: string
    note?: string
    isDone?: boolean
    order?: number
}

export interface CreateTaskInput {
    title: string
    dueDate?: string
    tag?: string
    note?: string
    order?: number
}