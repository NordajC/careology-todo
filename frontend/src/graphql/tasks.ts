import { gql } from "@apollo/client"

//graphql operations

export const GET_TASKS = gql`
    query GetTasks {
        getTasks {
            id
            title
            isDone
            dueDate
            tag
            note
            order
            weather {
                city
                temp
                icon
            }
        }
    }
`;

export const CREATE_TASK = gql`
    mutation CreateTask($input: CreateTaskInput!) {
        createTask(input: $input) {
            id
            title
            isDone
            dueDate
            tag
            note
            order
            weather {
                city
                temp
                icon
            }
        }
    }
`;

export const UPDATE_TASK = gql`
    mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
        updateTask(id: $id, input: $input) {
            id
            title
            isDone
            dueDate
            tag
            note
            order
        }
    }
`;

export const DELETE_TASK = gql`
    mutation DeleteTask($id: ID!) {
        deleteTask(id: $id)
    }
`;

export const TOGGLE_TASK = gql`
    mutation ToggleTask($id: ID!) {
        toggleTask(id: $id) {
            id
            isDone
        }
    }
`;

export const REORDER_TASKS = gql`
    mutation ReorderTasks($orderedIds: [ID!]!) {
        reorderTasks(orderedIds: $orderedIds) {
            id
            order
        }
    }
`