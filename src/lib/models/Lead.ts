import mongoose, { Schema, Document } from "mongoose"

export interface ILead extends Document {
  name: string
  company: string
  email: string
  phone: string
  source: string
  industry: string
  score: number
  status: string
  assignedTo: string
  notes: string
  createdAt: Date
  updatedAt: Date
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true },
    company: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    source: { type: String, default: "Website" },
    industry: { type: String, default: "" },
    score: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Proposal Sent", "Negotiation", "Won", "Lost"],
      default: "New",
    },
    assignedTo: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
)

export const Lead = mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema)
