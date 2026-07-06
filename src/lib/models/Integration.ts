import mongoose, { Schema, Document } from "mongoose"

export interface IIntegration extends Document {
  name: string
  description: string
  icon: string
  category: string
  connected: boolean
  createdAt: Date
}

const IntegrationSchema = new Schema<IIntegration>(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    category: { type: String, default: "" },
    connected: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const Integration = mongoose.models.Integration || mongoose.model<IIntegration>("Integration", IntegrationSchema)
