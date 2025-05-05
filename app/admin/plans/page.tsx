"use client"

import { useState } from "react"
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
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { plans as initialPlans, companies, planTypes, states, getCompanyById, getPlanTypeById } from "@/lib/data"

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

export default function PlansPage() {
  const [plans, setPlans] = useState(initialPlans)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentPlan, setCurrentPlan] = useState(null)
  const [newPlan, setNewPlan] = useState({
    name: "",
    companyId: "",
    planTypeId: "",
    stateIds: [],
    active: true,
  })

  const handleAddPlan = () => {
    const id = (plans.length + 1).toString()
    setPlans([...plans, { id, ...newPlan }])
    setNewPlan({
      name: "",
      companyId: "",
      planTypeId: "",
      stateIds: [],
      active: true,
    })
    setIsAddDialogOpen(false)
  }

  const handleEditPlan = () => {
    setPlans(plans.map((plan) => (plan.id === currentPlan.id ? currentPlan : plan)))
    setIsEditDialogOpen(false)
  }

  const handleDeletePlan = (id) => {
    setPlans(plans.filter((plan) => plan.id !== id))
  }

  const handleStateSelection = (stateId, isSelected, isNewPlan = false) => {
    if (isNewPlan) {
      if (isSelected) {
        setNewPlan({
          ...newPlan,
          stateIds: [...newPlan.stateIds, stateId],
        })
      } else {
        setNewPlan({
          ...newPlan,
          stateIds: newPlan.stateIds.filter((id) => id !== stateId),
        })
      }
    } else {
      if (isSelected) {
        setCurrentPlan({
          ...currentPlan,
          stateIds: [...currentPlan.stateIds, stateId],
        })
      } else {
        setCurrentPlan({
          ...currentPlan,
          stateIds: currentPlan.stateIds.filter((id) => id !== stateId),
        })
      }
    }
  }

  return (
    <SidebarNav items={adminNavItems} title="Admin">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Plans</CardTitle>
            <CardDescription>Manage insurance plans in the system</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Plan</DialogTitle>
                <DialogDescription>Enter the details for the new insurance plan</DialogDescription>
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
                  <Label htmlFor="company">Company</Label>
                  <Select
                    value={newPlan.companyId}
                    onValueChange={(value) => setNewPlan({ ...newPlan, companyId: value })}
                  >
                    <SelectTrigger id="company">
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="planType">Plan Type</Label>
                  <Select
                    value={newPlan.planTypeId}
                    onValueChange={(value) => setNewPlan({ ...newPlan, planTypeId: value })}
                  >
                    <SelectTrigger id="planType">
                      <SelectValue placeholder="Select plan type" />
                    </SelectTrigger>
                    <SelectContent>
                      {planTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Available States</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                    {states.map((state) => (
                      <div key={state.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`state-${state.id}`}
                          checked={newPlan.stateIds.includes(state.id)}
                          onChange={(e) => handleStateSelection(state.id, e.target.checked, true)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={`state-${state.id}`} className="text-sm">
                          {state.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={newPlan.active}
                    onCheckedChange={(checked) => setNewPlan({ ...newPlan, active: checked })}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPlan}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>States</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => {
                const company = getCompanyById(plan.companyId)
                const planType = getPlanTypeById(plan.planTypeId)

                return (
                  <TableRow key={plan.id}>
                    <TableCell>{plan.name}</TableCell>
                    <TableCell>{company ? company.name : "Unknown"}</TableCell>
                    <TableCell>{planType ? planType.name : "Unknown"}</TableCell>
                    <TableCell>{plan.stateIds.length} states</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          plan.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {plan.active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog
                        open={isEditDialogOpen && currentPlan?.id === plan.id}
                        onOpenChange={(open) => {
                          setIsEditDialogOpen(open)
                          if (!open) setCurrentPlan(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setCurrentPlan(plan)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Plan</DialogTitle>
                            <DialogDescription>Update the plan details</DialogDescription>
                          </DialogHeader>
                          {currentPlan && (
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="edit-name">Plan Name</Label>
                                <Input
                                  id="edit-name"
                                  value={currentPlan.name}
                                  onChange={(e) =>
                                    setCurrentPlan({
                                      ...currentPlan,
                                      name: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-company">Company</Label>
                                <Select
                                  value={currentPlan.companyId}
                                  onValueChange={(value) => setCurrentPlan({ ...currentPlan, companyId: value })}
                                >
                                  <SelectTrigger id="edit-company">
                                    <SelectValue placeholder="Select company" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {companies.map((company) => (
                                      <SelectItem key={company.id} value={company.id}>
                                        {company.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-planType">Plan Type</Label>
                                <Select
                                  value={currentPlan.planTypeId}
                                  onValueChange={(value) => setCurrentPlan({ ...currentPlan, planTypeId: value })}
                                >
                                  <SelectTrigger id="edit-planType">
                                    <SelectValue placeholder="Select plan type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {planTypes.map((type) => (
                                      <SelectItem key={type.id} value={type.id}>
                                        {type.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label>Available States</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                                  {states.map((state) => (
                                    <div key={state.id} className="flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        id={`edit-state-${state.id}`}
                                        checked={currentPlan.stateIds.includes(state.id)}
                                        onChange={(e) => handleStateSelection(state.id, e.target.checked)}
                                        className="rounded border-gray-300"
                                      />
                                      <Label htmlFor={`edit-state-${state.id}`} className="text-sm">
                                        {state.name}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="edit-active"
                                  checked={currentPlan.active}
                                  onCheckedChange={(checked) =>
                                    setCurrentPlan({
                                      ...currentPlan,
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
                            <Button onClick={handleEditPlan}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" onClick={() => handleDeletePlan(plan.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </SidebarNav>
  )
}
