//types for task
export interface Weather {
    city: string;
    temp: string;
    icon?: string;
}

export interface Task {
    id: string;
    title: string;
    isDone: boolean;
    dueDate?: string;
    tag?: string;
    note?: string;
    order: number;
    weather?: Weather;
}
