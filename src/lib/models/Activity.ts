import mongoose, { Schema, Document } from "mongoose"

export interface IActivity extends Document {
  type: string
  subject: string
  description: string
  relatedTo: string
  relatedType: string
  assignedTo: string
  status: string
  date: string
  createdAt: Date
}

const ActivitySchema = new Schema<IActivity>(
  {
    type: {
      type: String,
      enum: ["Call", "Email", "Meeting", "Follow-up", "Note", "Task"],
      required: true,
    },
    subject: { type: String, default: "" },
    description: { type: String, default: "" },
    relatedTo: { type: String, default: "" },
    relatedType: { type: String, default: "" },
    assignedTo: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Completed", "Scheduled", "Overdue"],
      default: "Scheduled",
    },
    date: { type: String, default: "" },
  },
  { timestamps: true }
)

export const Activity = mongoose.models.Activity || mongoose.model<IActivity>("Activity", ActivitySchema)
