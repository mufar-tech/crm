import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Lead } from "@/lib/models/Lead"
import { authenticateRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectDB()
  const leads = await Lead.find().sort({ createdAt: -1 })
  return NextResponse.json(leads)
}

export async function POST(request: NextRequest) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    await connectDB()
    const body = await request.json()
    const lead = await Lead.create(body)
    return NextResponse.json(lead, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
