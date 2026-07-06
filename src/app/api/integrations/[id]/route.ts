import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Integration } from "@/lib/models/Integration"
import { authenticateRequest } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  try {
    await connectDB()
    const body = await request.json()
    const integration = await Integration.findByIdAndUpdate(id, body, { new: true })
    if (!integration) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(integration)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
