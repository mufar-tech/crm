import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Communication } from "@/lib/models/Communication"
import { authenticateRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectDB()
  const communications = await Communication.find().sort({ date: -1 })
  return NextResponse.json(communications)
}

export async function POST(request: NextRequest) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    await connectDB()
    const body = await request.json()
    const comm = await Communication.create(body)
    return NextResponse.json(comm, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
