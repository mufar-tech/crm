import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Opportunity } from "@/lib/models/Opportunity"
import { authenticateRequest } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  await connectDB()
  const opportunity = await Opportunity.findById(id)
  if (!opportunity) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(opportunity)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  try {
    await connectDB()
    const body = await request.json()
    const opportunity = await Opportunity.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!opportunity) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(opportunity)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  await connectDB()
  const opportunity = await Opportunity.findByIdAndDelete(id)
  if (!opportunity) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ message: "Deleted" })
}
