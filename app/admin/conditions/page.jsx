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
  X,
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

export default function ConditionsPage() {
  const [conditions, setConditions] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentCondition, setCurrentCondition] = useState(null)
  const [newCondition, setNewCondition] = useState({
    name: "",
    description: "",
    active: true,
    tags: [],
    alternatives: [],
  })

  const [newTag, setNewTag] = useState("")
  const [newAlternative, setNewAlternative] = useState("")

  useEffect(() => {
    async function loadConditions() {
      setLoading(true)
      const res = await fetch("/api/conditions")
      const data = await res.json()
      setConditions(data)
      setLoading(false)
    }
    loadConditions()
  }, [])

  const handleAddCondition = async () => {
    const res = await fetch("/api/conditions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCondition),
    })

    const created = await res.json()
    setConditions((prev) => [...prev, created])
    setNewCondition({ name: "", description: "", active: true, tags: [], alternatives: [] })
    setIsAddDialogOpen(false)
  }

  const handleEditCondition = async () => {
    const res = await fetch(`/api/conditions/${currentCondition.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentCondition),
    })

    const updated = await res.json()
    setConditions((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    setIsEditDialogOpen(false)
  }

  const handleDeleteCondition = async (id) => {
    if (!confirm("Delete this health condition?")) return
    await fetch(`/api/conditions/${id}`, { method: "DELETE" })
    setConditions((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <SidebarNav items={adminNavItems} title="Admin">
      <div className="px-6 py-8">
        <Card className="w-full max-w-[1600px] mx-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Health Conditions</CardTitle>
              <CardDescription>Manage health conditions in the system</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setNewCondition({ name: "", description: "", active: true, tags: [], alternatives: [] })}>
                  <Plus className="h-4 w-4 mr-2" /> Add Condition
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Health Condition</DialogTitle>
                  <DialogDescription>Enter details for the condition</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Condition Name</Label>
                    <Input id="name" value={newCondition.name} onChange={(e) => setNewCondition({ ...newCondition, name: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={newCondition.description} onChange={(e) => setNewCondition({ ...newCondition, description: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input id="tags" placeholder="comma,separated,tags" value={newCondition.tags.join(",")} onChange={(e) => setNewCondition({ ...newCondition, tags: e.target.value.split(",").map(tag => tag.trim()) })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="alternatives">Alternatives</Label>
                    <Input id="alternatives" placeholder="comma,separated,list" value={newCondition.alternatives.join(",")} onChange={(e) => setNewCondition({ ...newCondition, alternatives: e.target.value.split(",").map(alt => alt.trim()) })} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="active" checked={newCondition.active} onCheckedChange={(checked) => setNewCondition({ ...newCondition, active: checked })} />
                    <Label htmlFor="active">Active</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddCondition}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>

          <CardContent>
            {loading ? <p>Loading...</p> : (
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
                  {conditions.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>{c.name}</TableCell>
                      <TableCell>{c.description}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(c.tags) ? c.tags : []).map((tag, i) => (
                            <span key={i} className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs">{tag}</span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(c.alternatives) ? c.alternatives : []).map((alt, i) => (
                            <span key={i} className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs">{alt}</span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${c.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {c.active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Dialog onOpenChange={(open) => {
                          if (open) {
                            setCurrentCondition(c)
                            setIsEditDialogOpen(true)
                          } else {
                            setCurrentCondition(null)
                            setIsEditDialogOpen(false)
                          }
                        }} open={isEditDialogOpen && currentCondition?.id === c.id}>
                          <DialogTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Condition</DialogTitle>
                              <DialogDescription>Modify the condition details</DialogDescription>
                            </DialogHeader>
                            {currentCondition && (
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-name">Name</Label>
                                  <Input
                                    id="edit-name"
                                    value={currentCondition.name}
                                    onChange={(e) => setCurrentCondition({ ...currentCondition, name: e.target.value })}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-description">Description</Label>
                                  <Textarea
                                    id="edit-description"
                                    value={currentCondition.description}
                                    onChange={(e) => setCurrentCondition({ ...currentCondition, description: e.target.value })}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-tags">Tags</Label>
                                  <Input
                                    id="edit-tags"
                                    value={currentCondition.tags.join(",")}
                                    onChange={(e) => setCurrentCondition({ ...currentCondition, tags: e.target.value.split(",").map(tag => tag.trim()) })}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-alternatives">Alternatives</Label>
                                  <Input
                                    id="edit-alternatives"
                                    value={currentCondition.alternatives.join(",")}
                                    onChange={(e) => setCurrentCondition({ ...currentCondition, alternatives: e.target.value.split(",").map(tag => tag.trim()) })}
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id="edit-active"
                                    checked={currentCondition.active}
                                    onCheckedChange={(checked) => setCurrentCondition({ ...currentCondition, active: checked })}
                                  />
                                  <Label htmlFor="edit-active">Active</Label>
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                              <Button onClick={handleEditCondition}>Save</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteCondition(c.id)}>
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
