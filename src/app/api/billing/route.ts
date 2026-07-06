import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Billing } from "@/lib/models/Billing"
import { authenticateRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectDB()
  const billings = await Billing.find().sort({ date: -1 })
  return NextResponse.json(billings)
}

export async function POST(request: NextRequest) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    await connectDB()
    const body = await request.json()
    const billing = await Billing.create(body)
    return NextResponse.json(billing, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
