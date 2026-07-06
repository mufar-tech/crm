import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Company } from "@/lib/models/Company"
import { authenticateRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectDB()
  const companies = await Company.find().sort({ createdAt: -1 })
  return NextResponse.json(companies)
}

export async function POST(request: NextRequest) {
  const user = authenticateRequest(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    await connectDB()
    const body = await request.json()
    const company = await Company.create(body)
    return NextResponse.json(company, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
