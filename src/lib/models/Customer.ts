import mongoose, { Schema, Document } from "mongoose"

export interface ICustomer extends Document {
  name: string
  email: string
  phone: string
  company: string
  industry: string
  status: string
  type: string
  owner: string
  tags: string[]
  notes: string
  createdAt: Date
  updatedAt: Date
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    company: { type: String, default: "" },
    industry: { type: String, default: "" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    type: { type: String, default: "New" },
    owner: { type: String, default: "" },
    tags: [{ type: String }],
    notes: { type: String, default: "" },
  },
  { timestamps: true }
)

export const Customer = mongoose.models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema)
