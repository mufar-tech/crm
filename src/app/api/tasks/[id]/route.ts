import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Task } from "@/lib/models/Task"
import { authenticateRequest } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  try {
    await connectDB()
    const body = await request.json()
    const task = await Task.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(task)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  await connectDB()
  const task = await Task.findByIdAndDelete(id)
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ message: "Deleted" })
}
