"use client"

import { useEffect, useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
  Trash2,
} from "lucide-react"
import { X } from "lucide-react"

const adminNavItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { title: "Companies", href: "/admin/companies", icon: <Building2 className="h-5 w-5" /> },
  { title: "Plans", href: "/admin/plans", icon: <FileText className="h-5 w-5" /> },
  { title: "Health Conditions", href: "/admin/conditions", icon: <Stethoscope className="h-5 w-5" /> },
  { title: "Medications", href: "/admin/medications", icon: <Pill className="h-5 w-5" /> },
  { title: "Questions", href: "/admin/questions", icon: <HelpCircle className="h-5 w-5" /> },
  { title: "Eligibility Rules", href: "/admin/rules", icon: <ShieldCheck className="h-5 w-5" /> },
]

export default function MedicationsPage() {
  const [medications, setMedications] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [newMedication, setNewMedication] = useState({
    id: null,
    name: "",
    description: "",
    active: true,
    tags: [],
    alternatives: [],
  })

  useEffect(() => {
    async function fetchMedications() {
      setLoading(true)
      const res = await fetch("/api/medications")
      const data = await res.json()
      setMedications(data)
      setLoading(false)
    }
    fetchMedications()
  }, [])

  const handleSubmit = async () => {
    const method = editMode ? "PUT" : "POST"
    const url = editMode
      ? `/api/medications/${newMedication.id}`
      : "/api/medications"

    const payload = {
      ...newMedication,
      tags: newMedication.tags,
      alternatives: newMedication.alternatives,
    }

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const result = await res.json()

    if (editMode) {
      setMedications((prev) =>
        prev.map((m) => (m.id === result.id ? result : m))
      )
    } else {
      setMedications((prev) => [...prev, result])
    }

    setNewMedication({
      id: null,
      name: "",
      description: "",
      active: true,
      tags: [],
      alternatives: [],
    })
    setEditMode(false)
    setDialogOpen(false)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this medication?")) return
    await fetch(`/api/medications/${id}`, { method: "DELETE" })
    setMedications((prev) => prev.filter((m) => m.id !== id))
  }

  const handleEdit = (medication) => {
    setNewMedication({
      ...medication,
      tags: medication.tags || [],
      alternatives: medication.alternatives || [],
    })
    setEditMode(true)
    setDialogOpen(true)
  }

  return (
    <SidebarNav items={adminNavItems} title="Admin">
      <div className="w-full px-6 py-8">
        <Card className="w-full max-w-[1600px] mx-auto border rounded-lg shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Medications</CardTitle>
              <CardDescription>Manage medications in the system</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditMode(false)
                    setNewMedication({
                      id: null,
                      name: "",
                      description: "",
                      active: true,
                      tags: [],
                      alternatives: [],
                    })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Medication
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editMode ? "Edit Medication" : "Add Medication"}</DialogTitle>
                  <DialogDescription>
                    {editMode
                      ? "Update the selected medication."
                      : "Enter details for the new medication."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newMedication.name}
                      onChange={(e) =>
                        setNewMedication({ ...newMedication, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newMedication.description}
                      onChange={(e) =>
                        setNewMedication({ ...newMedication, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      value={newMedication.tags.join(", ")}
                      onChange={(e) =>
                        setNewMedication({
                          ...newMedication,
                          tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="alternatives">Alternatives (comma separated)</Label>
                    <Input
                      id="alternatives"
                      value={newMedication.alternatives.join(", ")}
                      onChange={(e) =>
                        setNewMedication({
                          ...newMedication,
                          alternatives: e.target.value.split(",").map((a) => a.trim()).filter(Boolean),
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={newMedication.active}
                      onCheckedChange={(checked) =>
                        setNewMedication({ ...newMedication, active: checked })
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
              <p>Loading medications...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Alternatives</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medications.map((med) => (
                    <TableRow key={med.id}>
                      <TableCell>{med.name}</TableCell>
                      <TableCell>{med.description}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {med.tags?.map((tag, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {med.alternatives?.map((alt, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs"
                            >
                              {alt}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            med.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {med.active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(med)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(med.id)}>
                          <Trash2 className="h-4 w-4" />
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
