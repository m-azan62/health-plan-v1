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
import { healthConditions as initialConditions } from "@/lib/data"

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

export default function ConditionsPage() {
  const [conditions, setConditions] = useState(initialConditions)
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

  const handleAddCondition = () => {
    const id = (conditions.length + 1).toString()
    setConditions([...conditions, { id, ...newCondition }])
    setNewCondition({
      name: "",
      description: "",
      active: true,
      tags: [],
      alternatives: [],
    })
    setIsAddDialogOpen(false)
  }

  const handleEditCondition = () => {
    setConditions(conditions.map((condition) => (condition.id === currentCondition.id ? currentCondition : condition)))
    setIsEditDialogOpen(false)
  }

  const handleDeleteCondition = (id) => {
    setConditions(conditions.filter((condition) => condition.id !== id))
  }

  const handleAddTag = (isNew = true) => {
    if (newTag.trim() === "") return

    if (isNew) {
      setNewCondition({
        ...newCondition,
        tags: [...newCondition.tags, newTag.trim()],
      })
    } else {
      setCurrentCondition({
        ...currentCondition,
        tags: [...currentCondition.tags, newTag.trim()],
      })
    }
    setNewTag("")
  }

  const handleRemoveTag = (tag, isNew = true) => {
    if (isNew) {
      setNewCondition({
        ...newCondition,
        tags: newCondition.tags.filter((t) => t !== tag),
      })
    } else {
      setCurrentCondition({
        ...currentCondition,
        tags: currentCondition.tags.filter((t) => t !== tag),
      })
    }
  }

  const handleAddAlternative = (isNew = true) => {
    if (newAlternative.trim() === "") return

    if (isNew) {
      setNewCondition({
        ...newCondition,
        alternatives: [...newCondition.alternatives, newAlternative.trim()],
      })
    } else {
      setCurrentCondition({
        ...currentCondition,
        alternatives: [...currentCondition.alternatives, newAlternative.trim()],
      })
    }
    setNewAlternative("")
  }

  const handleRemoveAlternative = (alternative, isNew = true) => {
    if (isNew) {
      setNewCondition({
        ...newCondition,
        alternatives: newCondition.alternatives.filter((a) => a !== alternative),
      })
    } else {
      setCurrentCondition({
        ...currentCondition,
        alternatives: currentCondition.alternatives.filter((a) => a !== alternative),
      })
    }
  }

  return (
    <SidebarNav items={adminNavItems} title="Admin">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Health Conditions</CardTitle>
            <CardDescription>Manage health conditions in the system</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Condition
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Health Condition</DialogTitle>
                <DialogDescription>Enter the details for the new health condition</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Condition Name</Label>
                  <Input
                    id="name"
                    value={newCondition.name}
                    onChange={(e) => setNewCondition({ ...newCondition, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newCondition.description}
                    onChange={(e) => setNewCondition({ ...newCondition, description: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newCondition.tags.map((tag, index) => (
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
                    {newCondition.alternatives.map((alternative, index) => (
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
                    checked={newCondition.active}
                    onCheckedChange={(checked) => setNewCondition({ ...newCondition, active: checked })}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCondition}>Save</Button>
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
              {conditions.map((condition) => (
                <TableRow key={condition.id}>
                  <TableCell>{condition.name}</TableCell>
                  <TableCell>{condition.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {condition.tags.map((tag, index) => (
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
                      {condition.alternatives.map((alt, index) => (
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
                        condition.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {condition.active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog
                      open={isEditDialogOpen && currentCondition?.id === condition.id}
                      onOpenChange={(open) => {
                        setIsEditDialogOpen(open)
                        if (!open) setCurrentCondition(null)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setCurrentCondition(condition)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Health Condition</DialogTitle>
                          <DialogDescription>Update the health condition details</DialogDescription>
                        </DialogHeader>
                        {currentCondition && (
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-name">Condition Name</Label>
                              <Input
                                id="edit-name"
                                value={currentCondition.name}
                                onChange={(e) =>
                                  setCurrentCondition({
                                    ...currentCondition,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-description">Description</Label>
                              <Textarea
                                id="edit-description"
                                value={currentCondition.description}
                                onChange={(e) =>
                                  setCurrentCondition({
                                    ...currentCondition,
                                    description: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-tags">Tags</Label>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {currentCondition.tags.map((tag, index) => (
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
                                {currentCondition.alternatives.map((alternative, index) => (
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
                                checked={currentCondition.active}
                                onCheckedChange={(checked) =>
                                  setCurrentCondition({
                                    ...currentCondition,
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
                          <Button onClick={handleEditCondition}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCondition(condition.id)}>
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
