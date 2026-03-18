import mongoose from 'mongoose'
import 'dotenv/config'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!)
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    process.exit(1) // kill the server if DB fails — no point running without it
  }
}