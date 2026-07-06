import mongoose, { Schema, Document } from "mongoose"

export interface IOpportunity extends Document {
  name: string
  customer: string
  customerId: string
  dealValue: number
  stage: string
  owner: string
  expectedCloseDate: string
  probability: number
  notes: string
  createdAt: Date
}

const OpportunitySchema = new Schema<IOpportunity>(
  {
    name: { type: String, required: true },
    customer: { type: String, default: "" },
    customerId: { type: String, default: "" },
    dealValue: { type: Number, default: 0 },
    stage: {
      type: String,
      enum: ["Lead", "Qualification", "Discovery", "Proposal", "Negotiation", "Won", "Lost"],
      default: "Lead",
    },
    owner: { type: String, default: "" },
    expectedCloseDate: { type: String, default: "" },
    probability: { type: Number, default: 0 },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
)

export const Opportunity = mongoose.models.Opportunity || mongoose.model<IOpportunity>("Opportunity", OpportunitySchema)
