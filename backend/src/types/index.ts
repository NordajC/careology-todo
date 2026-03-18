export interface CreateTaskInput {
  title: string
  dueDate?: string
  tag?: string
  note?: string
  order?: number
}

export interface UpdateTaskInput {
  title?: string
  dueDate?: string
  tag?: string
  note?: string
  isDone?: boolean
  order?: number
}

export interface Context {
  user: {
    uid: string
    email?: string
  } | null
}