import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Contact } from "@/lib/models/Contact"
import { authenticateRequest } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  await connectDB()
  const contact = await Contact.findById(id)
  if (!contact) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(contact)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  try {
    await connectDB()
    const body = await request.json()
    const contact = await Contact.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!contact) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(contact)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  await connectDB()
  const contact = await Contact.findByIdAndDelete(id)
  if (!contact) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ message: "Deleted" })
}
