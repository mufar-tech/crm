import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Task } from "@/lib/models/Task"
import { authenticateRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectDB()
  const tasks = await Task.find().sort({ createdAt: -1 })
  return NextResponse.json(tasks)
}

export async function POST(request: NextRequest) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    await connectDB()
    const body = await request.json()
    const task = await Task.create(body)
    return NextResponse.json(task, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
