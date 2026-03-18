export const typeDefs = `#graphql

  # ─── Types ───────────────────────────────────────────

  type Weather {
    city: String
    temp: String
    icon: String
  }

  type Task {
    id: ID!
    title: String!
    isDone: Boolean!
    dueDate: String
    tag: String
    note: String
    order: Int!
    weather: Weather
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    message: String!
  }

  # ─── Inputs ──────────────────────────────────────────
  # Inputs are reusable argument shapes for mutations
  # Think of them like TypeScript interfaces for arguments

  input CreateTaskInput {
    title: String!
    dueDate: String
    tag: String
    note: String
    order: Int
  }

  input UpdateTaskInput {
    title: String
    dueDate: String
    tag: String
    note: String
    isDone: Boolean
    order: Int
  }

  # ─── Queries ─────────────────────────────────────────

  type Query {
    # Get all tasks for the logged in user
    getTasks: [Task!]!

    # Get a single task by ID
    getTask(id: ID!): Task
  }

  # ─── Mutations ───────────────────────────────────────

  type Mutation {
    # Task CRUD
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Boolean!

    # Separate mutation for toggling done state
    # cleaner than using updateTask for this
    toggleTask(id: ID!): Task!

    # Reordering tasks (for drag and drop)
    reorderTasks(orderedIds: [ID!]!): [Task!]!
  }
`