import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Opportunity } from "@/lib/models/Opportunity"
import { authenticateRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectDB()
  const opportunities = await Opportunity.find().sort({ createdAt: -1 })
  return NextResponse.json(opportunities)
}

export async function POST(request: NextRequest) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    await connectDB()
    const body = await request.json()
    const opportunity = await Opportunity.create(body)
    return NextResponse.json(opportunity, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
