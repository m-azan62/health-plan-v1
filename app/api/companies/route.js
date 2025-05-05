import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/companies
export async function GET() {
  try {
    const companies = await prisma.company.findMany();
    return NextResponse.json(companies);
  } catch (error) {
    console.error("❌ Error fetching companies:", error);
    return NextResponse.json({ error: "Failed to load companies" }, { status: 500 });
  }
}

// POST /api/companies
export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.name) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    const newCompany = await prisma.company.create({
      data: {
        name: data.name,
        active: data.active ?? true,
      },
    });

    return NextResponse.json(newCompany);
  } catch (error) {
    console.error("❌ Error creating company:", error);
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 });
  }
}
