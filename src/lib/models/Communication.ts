import mongoose, { Schema, Document } from "mongoose"

export interface ICommunication extends Document {
  type: string
  subject: string
  content: string
  from: string
  to: string
  relatedTo: string
  relatedType: string
  date: string
  createdAt: Date
}

const CommunicationSchema = new Schema<ICommunication>(
  {
    type: {
      type: String,
      enum: ["Email", "Meeting", "Call", "Note", "Comment"],
      required: true,
    },
    subject: { type: String, default: "" },
    content: { type: String, default: "" },
    from: { type: String, default: "" },
    to: { type: String, default: "" },
    relatedTo: { type: String, default: "" },
    relatedType: { type: String, default: "" },
    date: { type: String, default: "" },
  },
  { timestamps: true }
)

export const Communication = mongoose.models.Communication || mongoose.model<ICommunication>("Communication", CommunicationSchema)
