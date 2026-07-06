import mongoose, { Schema, Document } from "mongoose"

export interface IBilling extends Document {
  customer: string
  customerId: string
  invoice: string
  amount: number
  status: string
  date: string
  dueDate: string
  createdAt: Date
}

const BillingSchema = new Schema<IBilling>(
  {
    customer: { type: String, required: true },
    customerId: { type: String, default: "" },
    invoice: { type: String, default: "" },
    amount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Paid", "Pending", "Overdue", "Cancelled"],
      default: "Pending",
    },
    date: { type: String, default: "" },
    dueDate: { type: String, default: "" },
  },
  { timestamps: true }
)

export const Billing = mongoose.models.Billing || mongoose.model<IBilling>("Billing", BillingSchema)
