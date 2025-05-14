"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Trash2, Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function PlanTypeManager() {
  const [planTypes, setPlanTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newType, setNewType] = useState({ name: "" })
  const [editType, setEditType] = useState(null)

  useEffect(() => {
    loadPlanTypes()
  }, [])

  const loadPlanTypes = async () => {
    setLoading(true)
    const res = await fetch("/api/plan-types")
    const data = await res.json()
    setPlanTypes(data)
    setLoading(false)
  }

  const handleAdd = async () => {
    const res = await fetch("/api/plan-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newType),
    })
    const created = await res.json()
    setPlanTypes([...planTypes, created])
    setNewType({ name: "" })
    setIsDialogOpen(false)
  }

  const handleEdit = async () => {
    const res = await fetch(`/api/plan-types/${editType.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editType),
    })
    const updated = await res.json()
    setPlanTypes(planTypes.map(pt => (pt.id === updated.id ? updated : pt)))
    setEditType(null)
    setIsEditDialogOpen(false)
  }

  const handleDelete = async (id) => {
    if (!confirm("Delete this plan type?")) return
    await fetch(`/api/plan-types/${id}`, { method: "DELETE" })
    setPlanTypes(planTypes.filter(pt => pt.id !== id))
  }

  return (
    <div className="mt-8 border rounded-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Manage Plan Types</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" /> Add Plan Type
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Plan Type</DialogTitle>
              <DialogDescription>Enter the name for the new plan type</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="typeName">Name</Label>
                <Input
                  id="typeName"
                  value={newType.name}
                  onChange={(e) => setNewType({ name: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {planTypes.map((pt) => (
              <TableRow key={pt.id}>
                <TableCell>{pt.id}</TableCell>
                <TableCell>{pt.name}</TableCell>
                <TableCell className="text-right flex gap-2 justify-end">
                  <Dialog
                    open={isEditDialogOpen && editType?.id === pt.id}
                    onOpenChange={(open) => {
                      setIsEditDialogOpen(open)
                      if (!open) setEditType(null)
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditType(pt)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Plan Type</DialogTitle>
                        <DialogDescription>Update the plan type name</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="editTypeName">Name</Label>
                          <Input
                            id="editTypeName"
                            value={editType?.name || ""}
                            onChange={(e) =>
                              setEditType({ ...editType, name: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleEdit}>Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(pt.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}