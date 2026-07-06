import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Contact } from "@/lib/models/Contact"
import { authenticateRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectDB()
  const contacts = await Contact.find().sort({ createdAt: -1 })
  return NextResponse.json(contacts)
}

export async function POST(request: NextRequest) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    await connectDB()
    const body = await request.json()
    const contact = await Contact.create(body)
    return NextResponse.json(contact, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
