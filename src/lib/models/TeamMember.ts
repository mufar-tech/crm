import mongoose, { Schema, Document } from "mongoose"

export interface ITeamMember extends Document {
  name: string
  email: string
  role: string
  avatar: string
  department: string
  leads: number
  deals: number
  revenue: number
  status: string
  joinedAt: string
  createdAt: Date
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true },
    email: { type: String, default: "" },
    role: {
      type: String,
      enum: ["Owner", "Admin", "Sales Manager", "Sales Representative", "Support Agent", "Viewer"],
      default: "Sales Representative",
    },
    avatar: { type: String, default: "" },
    department: { type: String, default: "" },
    leads: { type: Number, default: 0 },
    deals: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    joinedAt: { type: String, default: "" },
  },
  { timestamps: true }
)

export const TeamMember = mongoose.models.TeamMember || mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema)
