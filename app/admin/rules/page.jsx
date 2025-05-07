"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  eligibilityRules as initialRules,
  plans,
  healthConditions,
  medications,
  questions,
  getPlanById,
  getHealthConditionById,
  getMedicationById,
  getQuestionById,
} from "@/lib/data"

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

export default function RulesPage() {
  const [rules, setRules] = useState(initialRules)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentRule, setCurrentRule] = useState(null)
  const [newRule, setNewRule] = useState({
    planId: "",
    type: "condition",
    entityId: "",
    rule: "block_if_yes",
    description: "",
    active: true,
  })

  const handleAddRule = () => {
    const id = (rules.length + 1).toString()
    setRules([...rules, { id, ...newRule }])
    setNewRule({
      planId: "",
      type: "condition",
      entityId: "",
      rule: "block_if_yes",
      description: "",
      active: true,
    })
    setIsAddDialogOpen(false)
  }

  const handleEditRule = () => {
    setRules(rules.map((rule) => (rule.id === currentRule.id ? currentRule : rule)))
    setIsEditDialogOpen(false)
  }

  const handleDeleteRule = (id) => {
    setRules(rules.filter((rule) => rule.id !== id))
  }

  const getEntityOptions = (type) => {
    switch (type) {
      case "condition":
        return healthConditions.map((condition) => ({
          id: condition.id,
          name: condition.name,
        }))
      case "medication":
        return medications.map((medication) => ({
          id: medication.id,
          name: medication.name,
        }))
      case "question":
        return questions.map((question) => ({
          id: question.id,
          name: question.text,
        }))
      default:
        return []
    }
  }

  const getEntityName = (type, id) => {
    switch (type) {
      case "condition":
        const condition = getHealthConditionById(id)
        return condition ? condition.name : "Unknown Condition"
      case "medication":
        const medication = getMedicationById(id)
        return medication ? medication.name : "Unknown Medication"
      case "question":
        const question = getQuestionById(id)
        return question ? question.text : "Unknown Question"
      default:
        return "Unknown Entity"
    }
  }

  return (
    <SidebarNav items={adminNavItems} title="Admin">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Eligibility Rules</CardTitle>
            <CardDescription>Manage plan eligibility rules</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Eligibility Rule</DialogTitle>
                <DialogDescription>Define a new rule for plan eligibility</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="plan">Plan</Label>
                  <Select value={newRule.planId} onValueChange={(value) => setNewRule({ ...newRule, planId: value })}>
                    <SelectTrigger id="plan">
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Rule Type</Label>
                  <Select
                    value={newRule.type}
                    onValueChange={(value) =>
                      setNewRule({
                        ...newRule,
                        type: value,
                        entityId: "", // Reset entity when type changes
                      })
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select rule type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="condition">Health Condition</SelectItem>
                      <SelectItem value="medication">Medication</SelectItem>
                      <SelectItem value="question">Question</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="entity">Entity</Label>
                  <Select
                    value={newRule.entityId}
                    onValueChange={(value) => setNewRule({ ...newRule, entityId: value })}
                  >
                    <SelectTrigger id="entity">
                      <SelectValue placeholder="Select entity" />
                    </SelectTrigger>
                    <SelectContent>
                      {getEntityOptions(newRule.type).map((entity) => (
                        <SelectItem key={entity.id} value={entity.id}>
                          {entity.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rule">Rule Action</Label>
                  <Select value={newRule.rule} onValueChange={(value) => setNewRule({ ...newRule, rule: value })}>
                    <SelectTrigger id="rule">
                      <SelectValue placeholder="Select rule action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="block_if_yes">Block If Yes</SelectItem>
                      <SelectItem value="block_if_no">Block If No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newRule.description}
                    onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                    placeholder="e.g., Block if stroke in past 2 years"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={newRule.active}
                    onCheckedChange={(checked) => setNewRule({ ...newRule, active: checked })}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRule}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Rule</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => {
                const plan = getPlanById(rule.planId)

                return (
                  <TableRow key={rule.id}>
                    <TableCell>{plan ? plan.name : "Unknown Plan"}</TableCell>
                    <TableCell className="capitalize">{rule.type}</TableCell>
                    <TableCell>{getEntityName(rule.type, rule.entityId)}</TableCell>
                    <TableCell>{rule.rule === "block_if_yes" ? "Block If Yes" : "Block If No"}</TableCell>
                    <TableCell>{rule.description}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          rule.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {rule.active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog
                        open={isEditDialogOpen && currentRule?.id === rule.id}
                        onOpenChange={(open) => {
                          setIsEditDialogOpen(open)
                          if (!open) setCurrentRule(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setCurrentRule(rule)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Eligibility Rule</DialogTitle>
                            <DialogDescription>Update the eligibility rule details</DialogDescription>
                          </DialogHeader>
                          {currentRule && (
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="edit-plan">Plan</Label>
                                <Select
                                  value={currentRule.planId}
                                  onValueChange={(value) => setCurrentRule({ ...currentRule, planId: value })}
                                >
                                  <SelectTrigger id="edit-plan">
                                    <SelectValue placeholder="Select plan" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {plans.map((plan) => (
                                      <SelectItem key={plan.id} value={plan.id}>
                                        {plan.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-type">Rule Type</Label>
                                <Select
                                  value={currentRule.type}
                                  onValueChange={(value) =>
                                    setCurrentRule({
                                      ...currentRule,
                                      type: value,
                                      entityId: "", // Reset entity when type changes
                                    })
                                  }
                                >
                                  <SelectTrigger id="edit-type">
                                    <SelectValue placeholder="Select rule type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="condition">Health Condition</SelectItem>
                                    <SelectItem value="medication">Medication</SelectItem>
                                    <SelectItem value="question">Question</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-entity">Entity</Label>
                                <Select
                                  value={currentRule.entityId}
                                  onValueChange={(value) => setCurrentRule({ ...currentRule, entityId: value })}
                                >
                                  <SelectTrigger id="edit-entity">
                                    <SelectValue placeholder="Select entity" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getEntityOptions(currentRule.type).map((entity) => (
                                      <SelectItem key={entity.id} value={entity.id}>
                                        {entity.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-rule">Rule Action</Label>
                                <Select
                                  value={currentRule.rule}
                                  onValueChange={(value) => setCurrentRule({ ...currentRule, rule: value })}
                                >
                                  <SelectTrigger id="edit-rule">
                                    <SelectValue placeholder="Select rule action" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="block_if_yes">Block If Yes</SelectItem>
                                    <SelectItem value="block_if_no">Block If No</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                  id="edit-description"
                                  value={currentRule.description}
                                  onChange={(e) =>
                                    setCurrentRule({
                                      ...currentRule,
                                      description: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="edit-active"
                                  checked={currentRule.active}
                                  onCheckedChange={(checked) =>
                                    setCurrentRule({
                                      ...currentRule,
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
                            <Button onClick={handleEditRule}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteRule(rule.id)}>
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
