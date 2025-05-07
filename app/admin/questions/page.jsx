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
import { questions as initialQuestions, companies, getCompanyById } from "@/lib/data"

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

export default function QuestionsPage() {
  const [questions, setQuestions] = useState(initialQuestions)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    companyId: "",
    active: true,
  })

  const handleAddQuestion = () => {
    const id = (questions.length + 1).toString()
    setQuestions([...questions, { id, ...newQuestion }])
    setNewQuestion({
      text: "",
      companyId: "",
      active: true,
    })
    setIsAddDialogOpen(false)
  }

  const handleEditQuestion = () => {
    setQuestions(questions.map((question) => (question.id === currentQuestion.id ? currentQuestion : question)))
    setIsEditDialogOpen(false)
  }

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter((question) => question.id !== id))
  }

  return (
    <SidebarNav items={adminNavItems} title="Admin">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Health Questions</CardTitle>
            <CardDescription>Manage health questions for underwriting</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Question</DialogTitle>
                <DialogDescription>Enter the details for the new health question</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="text">Question Text</Label>
                  <Textarea
                    id="text"
                    value={newQuestion.text}
                    onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                    placeholder="e.g., Have you had a stroke in the past 2 years?"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company">Company</Label>
                  <Select
                    value={newQuestion.companyId}
                    onValueChange={(value) => setNewQuestion({ ...newQuestion, companyId: value })}
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
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={newQuestion.active}
                    onCheckedChange={(checked) => setNewQuestion({ ...newQuestion, active: checked })}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddQuestion}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((question) => {
                const company = getCompanyById(question.companyId)

                return (
                  <TableRow key={question.id}>
                    <TableCell>{question.text}</TableCell>
                    <TableCell>{company ? company.name : "Unknown"}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          question.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {question.active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog
                        open={isEditDialogOpen && currentQuestion?.id === question.id}
                        onOpenChange={(open) => {
                          setIsEditDialogOpen(open)
                          if (!open) setCurrentQuestion(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setCurrentQuestion(question)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Question</DialogTitle>
                            <DialogDescription>Update the question details</DialogDescription>
                          </DialogHeader>
                          {currentQuestion && (
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="edit-text">Question Text</Label>
                                <Textarea
                                  id="edit-text"
                                  value={currentQuestion.text}
                                  onChange={(e) =>
                                    setCurrentQuestion({
                                      ...currentQuestion,
                                      text: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-company">Company</Label>
                                <Select
                                  value={currentQuestion.companyId}
                                  onValueChange={(value) =>
                                    setCurrentQuestion({ ...currentQuestion, companyId: value })
                                  }
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
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="edit-active"
                                  checked={currentQuestion.active}
                                  onCheckedChange={(checked) =>
                                    setCurrentQuestion({
                                      ...currentQuestion,
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
                            <Button onClick={handleEditQuestion}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteQuestion(question.id)}>
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
