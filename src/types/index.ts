export interface Lead {
  id: string
  name: string
  company: string
  email: string
  phone: string
  source: string
  industry: string
  score: number
  status: LeadStatus
  assignedTo: string
  notes: string
  createdAt: string
  updatedAt: string
}

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Proposal Sent"
  | "Negotiation"
  | "Won"
  | "Lost"

export interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  jobTitle: string
  company: string
  industry: string
  avatar: string
  status: "Active" | "Inactive"
  tags: string[]
  notes: string
  createdAt: string
  updatedAt: string
}

export interface Company {
  id: string
  name: string
  industry: string
  website: string
  revenue: string
  employees: number
  address: string
  city: string
  country: string
  phone: string
  email: string
  status: "Active" | "Inactive"
  contacts: number
  opportunities: number
  createdAt: string
}

export interface Opportunity {
  id: string
  name: string
  customer: string
  customerId: string
  dealValue: number
  stage: PipelineStage
  owner: string
  expectedCloseDate: string
  probability: number
  notes: string
  createdAt: string
}

export type PipelineStage =
  | "Lead"
  | "Qualification"
  | "Discovery"
  | "Proposal"
  | "Negotiation"
  | "Won"
  | "Lost"

export interface PipelineItem {
  id: string
  title: string
  value: number
  company: string
  owner: string
  stage: PipelineStage
}

export interface Activity {
  id: string
  type: "Call" | "Email" | "Meeting" | "Follow-up" | "Note" | "Task"
  subject: string
  description: string
  relatedTo: string
  relatedType: string
  assignedTo: string
  status: "Completed" | "Scheduled" | "Overdue"
  date: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  relatedTo: string
  relatedType: string
  assignedTo: string
  priority: "Low" | "Medium" | "High" | "Urgent"
  status: "Pending" | "In Progress" | "Completed" | "Cancelled"
  dueDate: string
  createdAt: string
}

export interface Communication {
  id: string
  type: "Email" | "Meeting" | "Call" | "Note" | "Comment"
  subject: string
  content: string
  from: string
  to: string
  relatedTo: string
  relatedType: string
  date: string
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: TeamRole
  avatar: string
  department: string
  leads: number
  deals: number
  revenue: number
  status: "Active" | "Inactive"
  joinedAt: string
}

export type TeamRole =
  | "Owner"
  | "Admin"
  | "Sales Manager"
  | "Sales Representative"
  | "Support Agent"
  | "Viewer"

export interface BillingInfo {
  id: string
  customer: string
  customerId: string
  invoice: string
  amount: number
  status: "Paid" | "Pending" | "Overdue" | "Cancelled"
  date: string
  dueDate: string
}

export interface Integration {
  id: string
  name: string
  description: string
  icon: string
  category: string
  connected: boolean
}

export interface DashboardKPI {
  label: string
  value: string | number
  change: number
  changeType: "increase" | "decrease"
  icon: string
}

export interface RevenueData {
  month: string
  revenue: number
  target: number
}

export interface ConversionData {
  stage: string
  count: number
  rate: number
}

export interface LeadSourceData {
  source: string
  count: number
  conversion: number
}

export interface ActivityTimeline {
  date: string
  activities: Activity[]
}
