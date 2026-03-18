import { Task } from './models/Task.js'
import type { Context, UpdateTaskInput, CreateTaskInput } from './types/index.js'
import { extractCity, fetchWeather } from './utils/weather.js'


export const resolvers = {
    Task: {
    dueDate: (task: any) => {
      if (!task.dueDate) return null
      // Return as YYYY-MM-DD string
      return new Date(task.dueDate).toISOString().split("T")[0]
    }
  },
  Query: {
    getTasks: async (_: unknown, __: unknown, context: Context) => {
      if (!context.user) throw new Error('Not authenticated')
      return Task.find({ userId: context.user.uid }).sort({ order: 1 })
    },

    getTask: async (_: unknown, { id }: { id: string }, context: Context) => {
      if (!context.user) throw new Error('Not authenticated')
      const task = await Task.findById(id)
      if (!task || task.userId !== context.user.uid) {
        throw new Error('Task not found')
      }
      return task
    },
  },

  Mutation: {
    createTask: async (_: unknown, { input }: { input: CreateTaskInput }, context: Context) => {
      if (!context.user) throw new Error('Not authenticated')

      const task = new Task({ ...input, userId: context.user.uid })
      await task.save()

      const city = extractCity(input.title)
      if (city) {
        const weather = await fetchWeather(city)
        if (weather) {
          task.weather = weather
          await task.save()
        }
      }

      return task
    },

    updateTask: async (_: unknown, { id, input }: { id: string; input: UpdateTaskInput }, context: Context) => {
      if (!context.user) throw new Error('Not authenticated')
      const task = await Task.findOneAndUpdate(
        { _id: id, userId: context.user.uid },
        input,
        { returnDocument: 'after' }
      )
      if (!task) throw new Error('Task not found')
      return task
    },

    deleteTask: async (_: unknown, { id }: { id: string }, context: Context) => {
      if (!context.user) throw new Error('Not authenticated')
      const result = await Task.deleteOne({ _id: id, userId: context.user.uid })
      return result.deletedCount === 1
    },

    reorderTasks: async (_: unknown, { orderedIds }: { orderedIds: string[] }, context: Context) => {
      if (!context.user) throw new Error('Not authenticated')

      // Build a bulk update: set each task's order to its index in the array
      // Only updates tasks that belong to the authenticated user
      const bulkOps = orderedIds.map((taskId, index) => ({
        updateOne: {
          filter: { _id: taskId, userId: context.user!.uid },
          update: { $set: { order: index } },
        },
      }))

      await Task.bulkWrite(bulkOps)

      // Return the tasks in their new order
      return Task.find({ userId: context.user.uid }).sort({ order: 1 })
    },

    toggleTask: async (_: unknown, { id }: { id: string }, context: Context) => {
      if (!context.user) throw new Error('Not authenticated')
      const task = await Task.findOne({ _id: id, userId: context.user.uid })
      if (!task) throw new Error('Task not found')
      task.isDone = !task.isDone
      await task.save()
      return task
    },
  },
}
