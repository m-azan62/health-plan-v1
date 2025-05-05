import { NextResponse } from "next/server"
import { getCompanyById, updateCompany, deleteCompany } from "@/lib/db"

export async function GET(request, { params }) {
  try {
    const id = params.id
    const company = await getCompanyById(id)

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    return NextResponse.json(company)
  } catch (error) {
    console.error("Error fetching company:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const id = params.id
    const data = await request.json()
    const company = await updateCompany(id, data)

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    return NextResponse.json(company)
  } catch (error) {
    console.error("Error updating company:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.id
    await deleteCompany(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting company:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
