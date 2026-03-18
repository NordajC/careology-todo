import 'dotenv/config'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { typeDefs } from './schema/index.js'
import { resolvers } from './resolvers.js'
import { connectDB } from './db.js'
import { verifyFirebaseToken } from './firebase.js'
import type { Context } from './types/index.js'

// This is the shape of your context object
// Every resolver will have access to this

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
})

const startServer = async () => {
  // Connect to MongoDB first
  await connectDB()

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }): Promise<Context> => {
      // Pull the token from the Authorization header
      // Frontend will send: "Bearer <firebase-token>"
      const authHeader = req.headers.authorization || ''
      const token = authHeader.replace('Bearer ', '')

      if (!token) return { user: null }

      const user = await verifyFirebaseToken(token)
      return { user }
    }
  })

  console.log(`Server running at ${url}`)
}

startServer().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})