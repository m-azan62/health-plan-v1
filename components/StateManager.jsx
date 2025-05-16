"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"

export default function StateManager() {
  const [states, setStates] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newState, setNewState] = useState({ name: "", short: "" })
  const [editState, setEditState] = useState({ id: "", name: "", short: "" })

  useEffect(() => {
    async function fetchStates() {
      setLoading(true)
      const res = await fetch("/api/states")
      const data = await res.json()
      setStates(data)
      setLoading(false)
    }
    fetchStates()
  }, [])

  const handleAdd = async () => {
    const res = await fetch("/api/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newState),
    })
    const saved = await res.json()
    setStates((prev) => [...prev, saved])
    setNewState({ name: "", short: "" })
    setIsAddDialogOpen(false)
  }

  const handleEdit = async () => {
    const res = await fetch(`/api/states/${editState.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editState.name, short: editState.short }),
    })
    const updated = await res.json()
    setStates((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    setIsEditDialogOpen(false)
  }

  const handleDelete = async (id) => {
    if (!confirm("Delete this state?")) return
    await fetch(`/api/states/${id}`, { method: "DELETE" })
    setStates((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>States</CardTitle>
          <CardDescription>Manage U.S. states for plan availability</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add State</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New State</DialogTitle>
              <DialogDescription>Provide the name and short code (e.g., CA).</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Short Code (e.g., CA)</Label>
                <Input value={newState.short} onChange={(e) => setNewState({ ...newState, short: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input value={newState.name} onChange={(e) => setNewState({ ...newState, name: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? <p>Loading...</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Short</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {states.map((state) => (
                <TableRow key={state.id}>
                  <TableCell>{state.id}</TableCell>
                  <TableCell>{state.name}</TableCell>
                  <TableCell>{state.short}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Dialog
                      open={isEditDialogOpen && editState.id === state.id}
                      onOpenChange={(open) => {
                        setIsEditDialogOpen(open)
                        if (!open) setEditState({ id: "", name: "", short: "" })
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button size="icon" variant="ghost" onClick={() => setEditState(state)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit State</DialogTitle>
                          <DialogDescription>Update the name and short code of the state.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label>Name</Label>
                            <Input
                              value={editState.name}
                              onChange={(e) => setEditState({ ...editState, name: e.target.value })}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Short</Label>
                            <Input
                              value={editState.short}
                              onChange={(e) => setEditState({ ...editState, short: e.target.value })}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                          <Button onClick={handleEdit}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(state.id)}>
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
  )
}
