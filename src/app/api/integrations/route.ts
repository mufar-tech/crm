import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Integration } from "@/lib/models/Integration"
import { authenticateRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectDB()
  const integrations = await Integration.find()
  return NextResponse.json(integrations)
}

export async function POST(request: NextRequest) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    await connectDB()
    const body = await request.json()
    const integration = await Integration.create(body)
    return NextResponse.json(integration, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
