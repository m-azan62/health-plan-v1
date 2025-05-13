"use client"

import { useEffect, useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  LayoutDashboard,
  Building2,
  FileText,
  Stethoscope,
  Pill,
  HelpCircle,
  ShieldCheck,
  Plus,
  Pencil,
  Trash2
} from "lucide-react"

const adminNavItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { title: "Companies", href: "/admin/companies", icon: <Building2 className="h-5 w-5" /> },
  { title: "Plans", href: "/admin/plans", icon: <FileText className="h-5 w-5" /> },
  { title: "Health Conditions", href: "/admin/conditions", icon: <Stethoscope className="h-5 w-5" /> },
  { title: "Medications", href: "/admin/medications", icon: <Pill className="h-5 w-5" /> },
  { title: "Questions", href: "/admin/questions", icon: <HelpCircle className="h-5 w-5" /> },
  { title: "Eligibility Rules", href: "/admin/rules", icon: <ShieldCheck className="h-5 w-5" /> },
]

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [companyForm, setCompanyForm] = useState({ id: null, name: "", active: true })

  useEffect(() => {
    async function fetchCompanies() {
      setLoading(true)
      const res = await fetch("/api/companies")
      const data = await res.json()
      setCompanies(data)
      setLoading(false)
    }
    fetchCompanies()
  }, [])

  const handleSubmit = async () => {
    const method = editMode ? "PUT" : "POST"
    const url = editMode ? `/api/companies/${companyForm.id}` : "/api/companies"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(companyForm),
    })

    const result = await res.json()
    if (editMode) {
      setCompanies((prev) => prev.map((c) => (c.id === result.id ? result : c)))
    } else {
      setCompanies((prev) => [...prev, result])
    }

    setCompanyForm({ id: null, name: "", active: true })
    setEditMode(false)
    setDialogOpen(false)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this company?")) return
    await fetch(`/api/companies/${id}`, { method: "DELETE" })
    setCompanies((prev) => prev.filter((c) => c.id !== id))
  }

  const openEditDialog = (company) => {
    setCompanyForm(company)
    setEditMode(true)
    setDialogOpen(true)
  }

  return (
    <SidebarNav items={adminNavItems} title="Admin">
      <div className="w-full px-6 py-8">
        <Card className="w-full max-w-[1600px] mx-auto border rounded-lg shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Companies</CardTitle>
              <CardDescription>Manage the insurance companies listed in the system</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditMode(false)
                    setCompanyForm({ id: null, name: "", active: true })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Company
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editMode ? "Edit Company" : "Add Company"}</DialogTitle>
                  <DialogDescription>
                    {editMode
                      ? "Update the selected company."
                      : "Enter details for the new company."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Company Name</Label>
                    <Input
                      id="name"
                      value={companyForm.name}
                      onChange={(e) =>
                        setCompanyForm({ ...companyForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={companyForm.active}
                      onCheckedChange={(checked) =>
                        setCompanyForm({ ...companyForm, active: checked })
                      }
                    />
                    <Label htmlFor="active">Active</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSubmit}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading companies...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>{company.name}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          company.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {company.active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(company)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(company.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarNav>
  )
}
