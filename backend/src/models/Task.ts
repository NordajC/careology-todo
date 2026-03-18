import mongoose from 'mongoose';

export interface IWeather {
  city: string;
  temp: string;
  icon?: string;
}

// Define the TypeScript Interface for type safety
export interface ITask extends mongoose.Document {
  title: string;
  isDone: boolean;
  dueDate?: Date;
  tag?: string;
  note?: string;
  userId: string; // link the task to the Firebase user
  weather?: IWeather;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isDone: { type: Boolean, default: false },
  dueDate: { type: Date },
  tag: { 
    type: String, 
    // the tags shown in the Figma design
    enum: ['Low', 'Medium', 'High'] // removed Urgent and Not urgent removing redundancy (low to high is also better standard)
  },
  note: { type: String },
  userId: { type: String, required: true }, 
  order:  { type: Number, default: 0 },   // for drag and drop
    weather: {
    city: { type: String },
    temp: { type: String },
    icon: { type: String }
  }
}, { 
  timestamps: true 
});

taskSchema.index({ userId: 1 }) // 

export const Task = mongoose.model<ITask>('Task', taskSchema);