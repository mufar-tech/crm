import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { TeamMember } from "@/lib/models/TeamMember"
import { authenticateRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectDB()
  const members = await TeamMember.find().sort({ name: 1 })
  return NextResponse.json(members)
}

export async function POST(request: NextRequest) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    await connectDB()
    const body = await request.json()
    const member = await TeamMember.create(body)
    return NextResponse.json(member, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
