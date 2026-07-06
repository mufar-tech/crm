import mongoose, { Schema, Document } from "mongoose"

export interface IContact extends Document {
  firstName: string
  lastName: string
  email: string
  phone: string
  jobTitle: string
  company: string
  industry: string
  avatar: string
  status: string
  tags: string[]
  notes: string
  createdAt: Date
  updatedAt: Date
}

const ContactSchema = new Schema<IContact>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    jobTitle: { type: String, default: "" },
    company: { type: String, default: "" },
    industry: { type: String, default: "" },
    avatar: { type: String, default: "" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    tags: [{ type: String }],
    notes: { type: String, default: "" },
  },
  { timestamps: true }
)

export const Contact = mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema)
