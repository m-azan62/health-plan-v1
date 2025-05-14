"use client"

import { useEffect, useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
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
import PlanTypeManager from "@/components/PlanTypeManager"
import StateManager from "@/components/StateManager"

const adminNavItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { title: "Companies", href: "/admin/companies", icon: <Building2 className="h-5 w-5" /> },
  { title: "Plans", href: "/admin/plans", icon: <FileText className="h-5 w-5" /> },
  { title: "Health Conditions", href: "/admin/conditions", icon: <Stethoscope className="h-5 w-5" /> },
  { title: "Medications", href: "/admin/medications", icon: <Pill className="h-5 w-5" /> },
  { title: "Questions", href: "/admin/questions", icon: <HelpCircle className="h-5 w-5" /> },
  { title: "Eligibility Rules", href: "/admin/rules", icon: <ShieldCheck className="h-5 w-5" /> },
]

export default function PlansPage() {
  const [plans, setPlans] = useState([])
  const [companies, setCompanies] = useState([])
  const [states, setStates] = useState([])
  const [planTypes, setPlanTypes] = useState([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPlan, setNewPlan] = useState({
    name: "",
    companyId: "",
    planTypeId: "",
    stateIds: [],
    active: true,
  })

  useEffect(() => {
    async function fetchData() {
      const [plansRes, companiesRes, statesRes, planTypesRes] = await Promise.all([
        fetch("/api/plans"),
        fetch("/api/companies"),
        fetch("/api/states"),
        fetch("/api/plan-types"),
      ])
      setPlans(await plansRes.json())
      setCompanies(await companiesRes.json())
      setStates(await statesRes.json())
      setPlanTypes(await planTypesRes.json())
    }
    fetchData()
  }, [])

  const handleAddPlan = async () => {
    const { name, companyId, planTypeId } = newPlan

    // Basic validation
    if (!name || !companyId || !planTypeId) {
      alert("Please fill in all required fields: Plan Name, Company, and Plan Type.")
      return
    }

    const payload = {
      ...newPlan,
      companyId: parseInt(newPlan.companyId),
      planTypeId: parseInt(newPlan.planTypeId),
    }

    console.log("📥 Sending payload:", payload)

    const res = await fetch("/api/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.json()
      console.error("❌ Error creating plan:", err)
      alert("Failed to create plan.")
      return
    }

    const created = await res.json()
    setPlans([...plans, created])
    setNewPlan({ name: "", companyId: "", planTypeId: "", stateIds: [], active: true })
    setIsAddDialogOpen(false)
  }

  const handleDeletePlan = async (id) => {
    await fetch(`/api/plans/${id}`, { method: "DELETE" })
    setPlans(plans.filter((p) => p.id !== id))
  }

  return (
    <SidebarNav items={adminNavItems} title="Admin">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Plans</CardTitle>
            <CardDescription>Manage insurance plans, plan types, and states</CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Plan
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Plan Type</TableHead>
                <TableHead>States</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>{companies.find((c) => c.id === plan.companyId)?.name || "-"}</TableCell>
                  <TableCell>{planTypes.find((pt) => pt.id === plan.planTypeId)?.name || "-"}</TableCell>
                  <TableCell>{plan.stateIds?.length || 0} states</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${plan.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {plan.active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeletePlan(plan.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Plan</DialogTitle>
            <DialogDescription>Fill in the details for the new plan</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Plan Name</Label>
              <Input
                id="name"
                value={newPlan.name}
                onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="companyId">Company</Label>
              <select
                id="companyId"
                value={newPlan.companyId}
                onChange={(e) => setNewPlan({ ...newPlan, companyId: e.target.value })}
                className="border rounded px-3 py-2"
              >
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="planTypeId">Plan Type</Label>
              <select
                id="planTypeId"
                value={newPlan.planTypeId}
                onChange={(e) => setNewPlan({ ...newPlan, planTypeId: e.target.value })}
                className="border rounded px-3 py-2"
              >
                <option value="">Select Type</option>
                {planTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stateIds">States</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-2">
                {states.map((s) => (
                  <label key={s.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newPlan.stateIds.includes(s.id)}
                      onChange={(e) => {
                        const checked = e.target.checked
                        setNewPlan((prev) => ({
                          ...prev,
                          stateIds: checked
                            ? [...prev.stateIds, s.id]
                            : prev.stateIds.filter((id) => id !== s.id),
                        }))
                      }}
                    />
                    {s.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={newPlan.active}
                onCheckedChange={(checked) =>
                  setNewPlan({ ...newPlan, active: checked })
                }
              />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddPlan}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Plan Type Manager Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Plan Types</CardTitle>
          <CardDescription>Manage plan types (e.g. HMO, PPO, etc)</CardDescription>
        </CardHeader>
        <CardContent>
          <PlanTypeManager />
        </CardContent>
      </Card>

      {/* State Manager Section */}
      <Card className="mt-6 mb-10">
        <CardHeader>
          <CardTitle>States</CardTitle>
          <CardDescription>Manage U.S. states for plan availability</CardDescription>
        </CardHeader>
        <CardContent>
          <StateManager />
        </CardContent>
      </Card>
    </SidebarNav>
  )
}
