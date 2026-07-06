import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/User"
import { Lead } from "@/lib/models/Lead"
import { Contact } from "@/lib/models/Contact"
import { Company } from "@/lib/models/Company"
import { Opportunity } from "@/lib/models/Opportunity"
import { Activity } from "@/lib/models/Activity"
import { Task } from "@/lib/models/Task"
import { Communication } from "@/lib/models/Communication"
import { TeamMember } from "@/lib/models/TeamMember"
import { Billing } from "@/lib/models/Billing"
import { Integration } from "@/lib/models/Integration"
import { Customer } from "@/lib/models/Customer"

export async function POST() {
  try {
    await connectDB()

    const existingAdmin = await User.findOne({ email: "admin@crm.com" })
    if (existingAdmin) {
      return NextResponse.json({ message: "Database already seeded" })
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 12)

    await User.create({
      name: "John Anderson",
      email: "admin@crm.com",
      password: hashedPassword,
      role: "Admin",
      department: "Sales",
    })

    const teamMembers = [
      { name: "Sarah Chen", email: "sarah@mufar.com", role: "Owner", department: "Sales", leads: 45, deals: 32, revenue: 520000, status: "Active", joinedAt: "2022-03-15T08:00:00.000Z" },
      { name: "Marcus Johnson", email: "marcus@mufar.com", role: "Admin", department: "Operations", leads: 38, deals: 28, revenue: 410000, status: "Active", joinedAt: "2022-06-01T08:00:00.000Z" },
      { name: "Emily Rodriguez", email: "emily@mufar.com", role: "Sales Manager", department: "Sales", leads: 52, deals: 41, revenue: 680000, status: "Active", joinedAt: "2023-01-10T08:00:00.000Z" },
      { name: "David Kim", email: "david@mufar.com", role: "Sales Representative", department: "Sales", leads: 67, deals: 23, revenue: 295000, status: "Active", joinedAt: "2023-09-20T08:00:00.000Z" },
      { name: "Lisa Thompson", email: "lisa@mufar.com", role: "Support Agent", department: "Support", leads: 12, deals: 8, revenue: 95000, status: "Active", joinedAt: "2024-02-14T08:00:00.000Z" },
    ]
    await TeamMember.insertMany(teamMembers)

    const leads = [
      { name: "Acme Corp", company: "Acme Corporation", email: "contact@acme.com", phone: "+1-555-0101", source: "Website", industry: "Technology", score: 85, status: "New", assignedTo: "Emily Rodriguez" },
      { name: "TechStart Inc", company: "TechStart Inc", email: "info@techstart.com", phone: "+1-555-0102", source: "Referral", industry: "Technology", score: 92, status: "Qualified", assignedTo: "David Kim" },
      { name: "GlobalSys Ltd", company: "GlobalSys Ltd", email: "hello@globalsys.com", phone: "+1-555-0103", source: "LinkedIn", industry: "Finance", score: 78, status: "Contacted", assignedTo: "Sarah Chen" },
      { name: "MediCare Plus", company: "MediCare Plus", email: "admin@medicare.com", phone: "+1-555-0104", source: "Email Campaign", industry: "Healthcare", score: 65, status: "Proposal Sent", assignedTo: "Marcus Johnson" },
      { name: "EduLearn Academy", company: "EduLearn Academy", email: "info@edulearn.com", phone: "+1-555-0105", source: "Mufar Forms", industry: "Education", score: 71, status: "Negotiation", assignedTo: "Emily Rodriguez" },
      { name: "RetailHub Co", company: "RetailHub Co", email: "sales@retailhub.com", phone: "+1-555-0106", source: "Website", industry: "Retail", score: 45, status: "New", assignedTo: "David Kim" },
      { name: "CloudNine Tech", company: "CloudNine Technologies", email: "info@cloudnine.io", phone: "+1-555-0107", source: "Referral", industry: "Technology", score: 95, status: "Qualified", assignedTo: "Sarah Chen" },
      { name: "GreenEnergy Corp", company: "GreenEnergy Corp", email: "contact@greenenergy.com", phone: "+1-555-0108", source: "Social Media", industry: "Manufacturing", score: 58, status: "Contacted", assignedTo: "Marcus Johnson" },
      { name: "DataFlow Systems", company: "DataFlow Systems", email: "info@dataflow.com", phone: "+1-555-0109", source: "Cold Call", industry: "Technology", score: 82, status: "Proposal Sent", assignedTo: "Emily Rodriguez" },
      { name: "PrimeRealty Group", company: "PrimeRealty Group", email: "info@primerealty.com", phone: "+1-555-0110", source: "LinkedIn", industry: "Real Estate", score: 73, status: "New", assignedTo: "David Kim" },
    ]
    await Lead.insertMany(leads)

    const contacts = [
      { firstName: "Michael", lastName: "Chen", email: "michael@acme.com", phone: "+1-555-0201", jobTitle: "CTO", company: "Acme Corporation", industry: "Technology", status: "Active", tags: ["VIP", "Decision Maker"], notes: "Key decision maker for Q3 deals" },
      { firstName: "Sarah", lastName: "Johnson", email: "sarah@techstart.com", phone: "+1-555-0202", jobTitle: "CEO", company: "TechStart Inc", industry: "Technology", status: "Active", tags: ["VIP"], notes: "Interested in enterprise plan" },
      { firstName: "James", lastName: "Williams", email: "james@globalsys.com", phone: "+1-555-0203", jobTitle: "VP Engineering", company: "GlobalSys Ltd", industry: "Finance", status: "Active", tags: ["Technical"], notes: "Needs custom integration" },
      { firstName: "Emily", lastName: "Brown", email: "emily@medicare.com", phone: "+1-555-0204", jobTitle: "Director of Ops", company: "MediCare Plus", industry: "Healthcare", status: "Active", tags: ["Healthcare"], notes: "Compliance requirements" },
      { firstName: "David", lastName: "Davis", email: "david@edulearn.com", phone: "+1-555-0205", jobTitle: "Head of Product", company: "EduLearn Academy", industry: "Education", status: "Active", tags: ["Education"], notes: "Needs student management" },
    ]
    await Contact.insertMany(contacts)

    const companies = [
      { name: "Acme Corporation", industry: "Technology", website: "https://acme.com", revenue: "$50M-$100M", employees: 500, address: "123 Tech Street", city: "San Francisco", country: "USA", phone: "+1-555-0301", email: "info@acme.com", status: "Active", contacts: 3, opportunities: 2 },
      { name: "TechStart Inc", industry: "Technology", website: "https://techstart.com", revenue: "$10M-$50M", employees: 200, address: "456 Innovation Ave", city: "Austin", country: "USA", phone: "+1-555-0302", email: "info@techstart.com", status: "Active", contacts: 2, opportunities: 1 },
      { name: "GlobalSys Ltd", industry: "Finance", website: "https://globalsys.com", revenue: "$100M-$500M", employees: 1000, address: "789 Finance Blvd", city: "New York", country: "USA", phone: "+1-555-0303", email: "hello@globalsys.com", status: "Active", contacts: 4, opportunities: 3 },
      { name: "MediCare Plus", industry: "Healthcare", website: "https://medicareplus.com", revenue: "$10M-$50M", employees: 300, address: "321 Health Dr", city: "Boston", country: "USA", phone: "+1-555-0304", email: "admin@medicare.com", status: "Active", contacts: 2, opportunities: 1 },
      { name: "EduLearn Academy", industry: "Education", website: "https://edulearn.com", revenue: "$5M-$10M", employees: 100, address: "555 Learning Ln", city: "Chicago", country: "USA", phone: "+1-555-0305", email: "info@edulearn.com", status: "Active", contacts: 1, opportunities: 2 },
    ]
    await Company.insertMany(companies)

    const opportunities = [
      { name: "Enterprise Platform Deal", customer: "Acme Corporation", customerId: "c1", dealValue: 150000, stage: "Qualification", owner: "Emily Rodriguez", expectedCloseDate: "2025-12-15", probability: 60, notes: "Interested in full platform" },
      { name: "Annual Subscription", customer: "TechStart Inc", customerId: "c2", dealValue: 75000, stage: "Proposal", owner: "David Kim", expectedCloseDate: "2025-11-01", probability: 80, notes: "Ready to sign" },
      { name: "Integration Project", customer: "GlobalSys Ltd", customerId: "c3", dealValue: 200000, stage: "Discovery", owner: "Sarah Chen", expectedCloseDate: "2026-01-15", probability: 40, notes: "Technical evaluation" },
      { name: "Compliance Package", customer: "MediCare Plus", customerId: "c4", dealValue: 95000, stage: "Negotiation", owner: "Marcus Johnson", expectedCloseDate: "2025-12-01", probability: 75, notes: "Finalizing terms" },
      { name: "Student Management Suite", customer: "EduLearn Academy", customerId: "c5", dealValue: 45000, stage: "Lead", owner: "Emily Rodriguez", expectedCloseDate: "2026-03-01", probability: 25, notes: "Initial discussion" },
    ]
    await Opportunity.insertMany(opportunities)

    const activities = [
      { type: "Call", subject: "Initial discovery call", description: "Discussed requirements and timeline", relatedTo: "Acme Corporation", relatedType: "Company", assignedTo: "Emily Rodriguez", status: "Completed", date: "2025-11-10T10:00:00.000Z" },
      { type: "Meeting", subject: "Product demo", description: "Demonstrated key features", relatedTo: "TechStart Inc", relatedType: "Company", assignedTo: "David Kim", status: "Completed", date: "2025-11-12T14:00:00.000Z" },
      { type: "Email", subject: "Proposal follow-up", description: "Sent additional documentation", relatedTo: "GlobalSys Ltd", relatedType: "Company", assignedTo: "Sarah Chen", status: "Completed", date: "2025-11-14T09:00:00.000Z" },
      { type: "Follow-up", subject: "Contract review", description: "Review contract terms", relatedTo: "MediCare Plus", relatedType: "Company", assignedTo: "Marcus Johnson", status: "Scheduled", date: "2025-12-01T11:00:00.000Z" },
      { type: "Task", subject: "Prepare quote", description: "Prepare detailed quote for enterprise plan", relatedTo: "EduLearn Academy", relatedType: "Company", assignedTo: "Emily Rodriguez", status: "Scheduled", date: "2025-12-05T10:00:00.000Z" },
    ]
    await Activity.insertMany(activities)

    const tasks = [
      { title: "Follow up with Acme Corp", description: "Send proposal and schedule demo", relatedTo: "Acme Corporation", relatedType: "Company", assignedTo: "Emily Rodriguez", priority: "High", status: "In Progress", dueDate: "2025-12-10T17:00:00.000Z" },
      { title: "Prepare quarterly report", description: "Compile Q4 sales data and metrics", relatedTo: "", relatedType: "", assignedTo: "Marcus Johnson", priority: "Urgent", status: "In Progress", dueDate: "2025-12-01T17:00:00.000Z" },
      { title: "Update contact list", description: "Clean and update CRM contacts", relatedTo: "", relatedType: "", assignedTo: "David Kim", priority: "Medium", status: "Pending", dueDate: "2025-12-15T17:00:00.000Z" },
    ]
    await Task.insertMany(tasks)

    const communications = [
      { type: "Email", subject: "Q4 Proposal", content: "Please find attached our Q4 proposal...", from: "emily@mufar.com", to: "michael@acme.com", relatedTo: "Acme Corporation", relatedType: "Company", date: "2025-11-10T10:30:00.000Z" },
      { type: "Meeting", subject: "Product Demo", content: "Demo of CRM platform features", from: "david@mufar.com", to: "sarah@techstart.com", relatedTo: "TechStart Inc", relatedType: "Company", date: "2025-11-12T14:00:00.000Z" },
      { type: "Call", subject: "Discovery Call", content: "Discussed integration requirements", from: "sarah@mufar.com", to: "james@globalsys.com", relatedTo: "GlobalSys Ltd", relatedType: "Company", date: "2025-11-14T09:15:00.000Z" },
      { type: "Email", subject: "Contract Terms", content: "Here are the updated contract terms...", from: "marcus@mufar.com", to: "emily@medicare.com", relatedTo: "MediCare Plus", relatedType: "Company", date: "2025-11-16T11:00:00.000Z" },
      { type: "Note", subject: "Meeting Notes", content: "Key points from client meeting...", from: "emily@mufar.com", to: "", relatedTo: "EduLearn Academy", relatedType: "Company", date: "2025-11-18T16:00:00.000Z" },
    ]
    await Communication.insertMany(communications)

    const billings = [
      { customer: "Acme Corporation", customerId: "c1", invoice: "INV-2025-001", amount: 45000, status: "Paid", date: "2025-10-01", dueDate: "2025-10-30" },
      { customer: "TechStart Inc", customerId: "c2", invoice: "INV-2025-002", amount: 25000, status: "Paid", date: "2025-10-15", dueDate: "2025-11-14" },
      { customer: "GlobalSys Ltd", customerId: "c3", invoice: "INV-2025-003", amount: 85000, status: "Pending", date: "2025-11-01", dueDate: "2025-12-01" },
      { customer: "MediCare Plus", customerId: "c4", invoice: "INV-2025-004", amount: 32000, status: "Overdue", date: "2025-10-20", dueDate: "2025-11-19" },
      { customer: "EduLearn Academy", customerId: "c5", invoice: "INV-2025-005", amount: 15000, status: "Pending", date: "2025-11-15", dueDate: "2025-12-15" },
    ]
    await Billing.insertMany(billings)

    const integrations = [
      { name: "Mufar Forms", description: "Connect your forms for seamless data collection", icon: "FileText", category: "Data Collection", connected: true },
      { name: "Gmail", description: "Sync emails and manage communications", icon: "Mail", category: "Communication", connected: true },
      { name: "Google Calendar", description: "Sync events and schedule meetings", icon: "Calendar", category: "Productivity", connected: true },
      { name: "Slack", description: "Get notifications and updates in Slack", icon: "MessageSquare", category: "Communication", connected: false },
      { name: "Stripe", description: "Process payments and manage subscriptions", icon: "CreditCard", category: "Payments", connected: false },
    ]
    await Integration.insertMany(integrations)

    const customers = [
      { name: "Robert Wilson", email: "robert@globaltech.com", phone: "+1-555-0401", company: "GlobalTech Solutions", industry: "Technology", status: "Active", type: "Enterprise", owner: "Emily Rodriguez", tags: ["Enterprise", "Long-term"], notes: "Key account, needs priority support" },
      { name: "Amanda Foster", email: "amanda@nordev.com", phone: "+1-555-0402", company: "NorDev Consulting", industry: "Technology", status: "Active", type: "SMB", owner: "David Kim", tags: ["SMB", "Fast-growing"], notes: "Quick decision maker" },
      { name: "Kevin Wright", email: "kevin@apexlogistics.com", phone: "+1-555-0403", company: "Apex Logistics", industry: "Manufacturing", status: "Active", type: "Enterprise", owner: "Sarah Chen", tags: ["Enterprise", "Logistics"], notes: "Needs custom logistics module" },
    ]
    await Customer.insertMany(customers)

    return NextResponse.json({ message: "Database seeded successfully" })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: "Send a POST request to seed the database" })
}
