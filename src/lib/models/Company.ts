import mongoose, { Schema, Document } from "mongoose"

export interface ICompany extends Document {
  name: string
  industry: string
  website: string
  revenue: string
  employees: number
  address: string
  city: string
  country: string
  phone: string
  email: string
  status: string
  contacts: number
  opportunities: number
  createdAt: Date
}

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true },
    industry: { type: String, default: "" },
    website: { type: String, default: "" },
    revenue: { type: String, default: "" },
    employees: { type: Number, default: 0 },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    country: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    contacts: { type: Number, default: 0 },
    opportunities: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const Company = mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema)
