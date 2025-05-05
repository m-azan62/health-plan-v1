import { NextResponse } from "next/server"
import { getCompanies, createCompany } from "@/lib/db"
import { mockCompanies } from "@/lib/mock-data"

export async function GET() {
  try {
    // Try to get companies from the database
    const companies = await getCompanies()
    return NextResponse.json(companies)
  } catch (error) {
    console.error("Error fetching companies from database:", error)

    // If in development mode, return mock data as fallback
    if (process.env.NODE_ENV === "development") {
      console.log("Using mock data as fallback")
      return NextResponse.json(mockCompanies)
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const company = await createCompany(data)
    return NextResponse.json(company)
  } catch (error) {
    console.error("Error creating company:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
