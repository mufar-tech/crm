import mongoose, { Schema, Document } from "mongoose"

export interface ITask extends Document {
  title: string
  description: string
  relatedTo: string
  relatedType: string
  assignedTo: string
  priority: string
  status: string
  dueDate: string
  createdAt: Date
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    relatedTo: { type: String, default: "" },
    relatedType: { type: String, default: "" },
    assignedTo: { type: String, default: "" },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
    dueDate: { type: String, default: "" },
  },
  { timestamps: true }
)

export const Task = mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema)
