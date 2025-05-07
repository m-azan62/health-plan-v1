"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { medications as initialMedications } from "@/lib/data"

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Companies",
    href: "/admin/companies",
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    title: "Plans",
    href: "/admin/plans",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Health Conditions",
    href: "/admin/conditions",
    icon: <Stethoscope className="h-5 w-5" />,
  },
  {
    title: "Medications",
    href: "/admin/medications",
    icon: <Pill className="h-5 w-5" />,
  },
  {
    title: "Questions",
    href: "/admin/questions",
    icon: <HelpCircle className="h-5 w-5" />,
  },
  {
    title: "Eligibility Rules",
    href: "/admin/rules",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
]

export default function MedicationsPage() {
  const [medications, setMedications] = useState(initialMedications)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentMedication, setCurrentMedication] = useState(null)
  const [newMedication, setNewMedication] = useState({
    name: "",
    description: "",
    active: true,
    tags: [],
    alternatives: [],
  })
  const [newTag, setNewTag] = useState("")
  const [newAlternative, setNewAlternative] = useState("")

  const handleAddMedication = () => {
    const id = (medications.length + 1).toString()
    setMedications([...medications, { id, ...newMedication }])
    setNewMedication({
      name: "",
      description: "",
      active: true,
      tags: [],
      alternatives: [],
    })
    setIsAddDialogOpen(false)
  }

  const handleEditMedication = () => {
    setMedications(
      medications.map((medication) => (medication.id === currentMedication.id ? currentMedication : medication)),
    )
    setIsEditDialogOpen(false)
  }

  const handleDeleteMedication = (id) => {
    setMedications(medications.filter((medication) => medication.id !== id))
  }

  const handleAddTag = (isNew = true) => {
    if (newTag.trim() === "") return

    if (isNew) {
      setNewMedication({
        ...newMedication,
        tags: [...newMedication.tags, newTag.trim()],
      })
    } else {
      setCurrentMedication({
        ...currentMedication,
        tags: [...currentMedication.tags, newTag.trim()],
      })
    }
    setNewTag("")
  }

  const handleRemoveTag = (tag, isNew = true) => {
    if (isNew) {
      setNewMedication({
        ...newMedication,
        tags: newMedication.tags.filter((t) => t !== tag),
      })
    } else {
      setCurrentMedication({
        ...currentMedication,
        tags: currentMedication.tags.filter((t) => t !== tag),
      })
    }
  }

  const handleAddAlternative = (isNew = true) => {
    if (newAlternative.trim() === "") return

    if (isNew) {
      setNewMedication({
        ...newMedication,
        alternatives: [...newMedication.alternatives, newAlternative.trim()],
      })
    } else {
      setCurrentMedication({
        ...currentMedication,
        alternatives: [...currentMedication.alternatives, newAlternative.trim()],
      })
    }
    setNewAlternative("")
  }

  const handleRemoveAlternative = (alternative, isNew = true) => {
    if (isNew) {
      setNewMedication({
        ...newMedication,
        alternatives: newMedication.alternatives.filter((a) => a !== alternative),
      })
    } else {
      setCurrentMedication({
        ...currentMedication,
        alternatives: currentMedication.alternatives.filter((a) => a !== alternative),
      })
    }
  }

  return (
    <SidebarNav items={adminNavItems} title="Admin">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Medications</CardTitle>
            <CardDescription>Manage medications in the system</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Medication</DialogTitle>
                <DialogDescription>Enter the details for the new medication</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Medication Name</Label>
                  <Input
                    id="name"
                    value={newMedication.name}
                    onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newMedication.description}
                    onChange={(e) => setNewMedication({ ...newMedication, description: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newMedication.tags.map((tag, index) => (
                      <div key={index} className="flex items-center bg-slate-100 rounded-full px-3 py-1 text-sm">
                        <span className="mr-1">{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-slate-500 hover:text-slate-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                    />
                    <Button type="button" onClick={() => handleAddTag()}>
                      Add
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="alternatives">Recommended Alternatives</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newMedication.alternatives.map((alternative, index) => (
                      <div key={index} className="flex items-center bg-slate-100 rounded-full px-3 py-1 text-sm">
                        <span className="mr-1">{alternative}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAlternative(alternative)}
                          className="text-slate-500 hover:text-slate-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="alternatives"
                      value={newAlternative}
                      onChange={(e) => setNewAlternative(e.target.value)}
                      placeholder="Add an alternative"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddAlternative()
                        }
                      }}
                    />
                    <Button type="button" onClick={() => handleAddAlternative()}>
                      Add
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={newMedication.active}
                    onCheckedChange={(checked) => setNewMedication({ ...newMedication, active: checked })}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMedication}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
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
              {medications.map((medication) => (
                <TableRow key={medication.id}>
                  <TableCell>{medication.name}</TableCell>
                  <TableCell>{medication.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {medication.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {medication.alternatives.map((alt, index) => (
                        <span
                          key={index}
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
                        medication.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {medication.active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog
                      open={isEditDialogOpen && currentMedication?.id === medication.id}
                      onOpenChange={(open) => {
                        setIsEditDialogOpen(open)
                        if (!open) setCurrentMedication(null)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setCurrentMedication(medication)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Medication</DialogTitle>
                          <DialogDescription>Update the medication details</DialogDescription>
                        </DialogHeader>
                        {currentMedication && (
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-name">Medication Name</Label>
                              <Input
                                id="edit-name"
                                value={currentMedication.name}
                                onChange={(e) =>
                                  setCurrentMedication({
                                    ...currentMedication,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-description">Description</Label>
                              <Textarea
                                id="edit-description"
                                value={currentMedication.description}
                                onChange={(e) =>
                                  setCurrentMedication({
                                    ...currentMedication,
                                    description: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-tags">Tags</Label>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {currentMedication.tags.map((tag, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center bg-slate-100 rounded-full px-3 py-1 text-sm"
                                  >
                                    <span className="mr-1">{tag}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveTag(tag, false)}
                                      className="text-slate-500 hover:text-slate-700"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  id="edit-tags"
                                  value={newTag}
                                  onChange={(e) => setNewTag(e.target.value)}
                                  placeholder="Add a tag"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault()
                                      handleAddTag(false)
                                    }
                                  }}
                                />
                                <Button type="button" onClick={() => handleAddTag(false)}>
                                  Add
                                </Button>
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-alternatives">Recommended Alternatives</Label>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {currentMedication.alternatives.map((alternative, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center bg-slate-100 rounded-full px-3 py-1 text-sm"
                                  >
                                    <span className="mr-1">{alternative}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveAlternative(alternative, false)}
                                      className="text-slate-500 hover:text-slate-700"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  id="edit-alternatives"
                                  value={newAlternative}
                                  onChange={(e) => setNewAlternative(e.target.value)}
                                  placeholder="Add an alternative"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault()
                                      handleAddAlternative(false)
                                    }
                                  }}
                                />
                                <Button type="button" onClick={() => handleAddAlternative(false)}>
                                  Add
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="edit-active"
                                checked={currentMedication.active}
                                onCheckedChange={(checked) =>
                                  setCurrentMedication({
                                    ...currentMedication,
                                    active: checked,
                                  })
                                }
                              />
                              <Label htmlFor="edit-active">Active</Label>
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleEditMedication}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteMedication(medication.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </SidebarNav>
  )
}
