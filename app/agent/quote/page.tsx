"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LayoutDashboard,
  Search,
  FileText,
  Users,
  BarChart,
  Settings,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { healthConditions, medications, states, companies, getQuestionsByCompanyId, getEligiblePlans } from "@/lib/data"

const agentNavItems = [
  {
    title: "Dashboard",
    href: "/agent/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "New Quote",
    href: "/agent/quote",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Clients",
    href: "/agent/clients",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Reports",
    href: "/agent/reports",
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/agent/settings",
    icon: <Settings className="h-5 w-5" />,
  },
]

export default function QuotePage() {
  const [activeTab, setActiveTab] = useState("client-info")
  const [searchCondition, setSearchCondition] = useState("")
  const [searchMedication, setSearchMedication] = useState("")
  const [clientData, setClientData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    state: "",
    conditions: [],
    medications: [],
    questionAnswers: {},
  })
  const [quoteResults, setQuoteResults] = useState(null)

  const filteredConditions = healthConditions.filter(
    (condition) =>
      condition.name.toLowerCase().includes(searchCondition.toLowerCase()) ||
      condition.description.toLowerCase().includes(searchCondition.toLowerCase()),
  )

  const filteredMedications = medications.filter(
    (medication) =>
      medication.name.toLowerCase().includes(searchMedication.toLowerCase()) ||
      medication.description.toLowerCase().includes(searchMedication.toLowerCase()),
  )

  const handleConditionToggle = (conditionId) => {
    setClientData((prev) => {
      if (prev.conditions.includes(conditionId)) {
        return {
          ...prev,
          conditions: prev.conditions.filter((id) => id !== conditionId),
        }
      } else {
        return {
          ...prev,
          conditions: [...prev.conditions, conditionId],
        }
      }
    })
  }

  const handleMedicationToggle = (medicationId) => {
    setClientData((prev) => {
      if (prev.medications.includes(medicationId)) {
        return {
          ...prev,
          medications: prev.medications.filter((id) => id !== medicationId),
        }
      } else {
        return {
          ...prev,
          medications: [...prev.medications, medicationId],
        }
      }
    })
  }

  const handleQuestionAnswer = (questionId, answer) => {
    setClientData((prev) => ({
      ...prev,
      questionAnswers: {
        ...prev.questionAnswers,
        [questionId]: answer,
      },
    }))
  }

  const handleGenerateQuote = () => {
    const results = getEligiblePlans(clientData)
    setQuoteResults(results)
    setActiveTab("results")
  }

  const nextTab = () => {
    if (activeTab === "client-info") setActiveTab("health-conditions")
    else if (activeTab === "health-conditions") setActiveTab("medications")
    else if (activeTab === "medications") setActiveTab("questions")
    else if (activeTab === "questions") handleGenerateQuote()
  }

  const prevTab = () => {
    if (activeTab === "health-conditions") setActiveTab("client-info")
    else if (activeTab === "medications") setActiveTab("health-conditions")
    else if (activeTab === "questions") setActiveTab("medications")
    else if (activeTab === "results") setActiveTab("questions")
  }

  // Group eligible plans by company
  const groupedEligiblePlans = quoteResults?.eligiblePlans.reduce((acc, plan) => {
    if (!acc[plan.company]) {
      acc[plan.company] = []
    }
    acc[plan.company].push(plan)
    return acc
  }, {})

  return (
    <SidebarNav items={agentNavItems} title="Agent">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">New Insurance Quote</h2>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="client-info">Client Info</TabsTrigger>
            <TabsTrigger value="health-conditions">Health Conditions</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="questions">Health Questions</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="client-info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
                <CardDescription>Enter the client's basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={clientData.firstName}
                      onChange={(e) => setClientData({ ...clientData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={clientData.lastName}
                      onChange={(e) => setClientData({ ...clientData, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={clientData.age}
                      onChange={(e) => setClientData({ ...clientData, age: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select
                      value={clientData.state}
                      onValueChange={(value) => setClientData({ ...clientData, state: value })}
                    >
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state.id} value={state.id}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" disabled>
                  Back
                </Button>
                <Button onClick={nextTab}>Next</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="health-conditions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Health Conditions</CardTitle>
                <CardDescription>Select any health conditions the client has</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search health conditions..."
                    value={searchCondition}
                    onChange={(e) => setSearchCondition(e.target.value)}
                  />
                </div>
                <div className="border rounded-md p-4 max-h-96 overflow-y-auto">
                  <div className="space-y-4">
                    {filteredConditions.map((condition) => (
                      <div key={condition.id} className="flex items-start space-x-3 p-2 hover:bg-slate-50 rounded-md">
                        <input
                          type="checkbox"
                          id={`condition-${condition.id}`}
                          checked={clientData.conditions.includes(condition.id)}
                          onChange={() => handleConditionToggle(condition.id)}
                          className="mt-1"
                        />
                        <div>
                          <Label htmlFor={`condition-${condition.id}`} className="font-medium">
                            {condition.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">{condition.description}</p>
                          {condition.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {condition.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevTab}>
                  Back
                </Button>
                <Button onClick={nextTab}>Next</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="medications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Medications</CardTitle>
                <CardDescription>Select any medications the client is taking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search medications..."
                    value={searchMedication}
                    onChange={(e) => setSearchMedication(e.target.value)}
                  />
                </div>
                <div className="border rounded-md p-4 max-h-96 overflow-y-auto">
                  <div className="space-y-4">
                    {filteredMedications.map((medication) => (
                      <div key={medication.id} className="flex items-start space-x-3 p-2 hover:bg-slate-50 rounded-md">
                        <input
                          type="checkbox"
                          id={`medication-${medication.id}`}
                          checked={clientData.medications.includes(medication.id)}
                          onChange={() => handleMedicationToggle(medication.id)}
                          className="mt-1"
                        />
                        <div>
                          <Label htmlFor={`medication-${medication.id}`} className="font-medium">
                            {medication.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">{medication.description}</p>
                          {medication.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {medication.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevTab}>
                  Back
                </Button>
                <Button onClick={nextTab}>Next</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Health Questions</CardTitle>
                <CardDescription>Answer the following health questions for the client</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {companies.map((company) => {
                  const companyQuestions = getQuestionsByCompanyId(company.id)
                  if (companyQuestions.length === 0) return null

                  return (
                    <div key={company.id} className="space-y-4">
                      <h3 className="font-semibold text-lg">{company.name}</h3>
                      <div className="space-y-4 pl-4">
                        {companyQuestions.map((question) => (
                          <div key={question.id} className="space-y-2">
                            <p className="text-sm font-medium">{question.text}</p>
                            <div className="flex space-x-4">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id={`question-${question.id}-yes`}
                                  name={`question-${question.id}`}
                                  checked={clientData.questionAnswers[question.id] === true}
                                  onChange={() => handleQuestionAnswer(question.id, true)}
                                  className="text-emerald-600"
                                />
                                <Label htmlFor={`question-${question.id}-yes`}>Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id={`question-${question.id}-no`}
                                  name={`question-${question.id}`}
                                  checked={clientData.questionAnswers[question.id] === false}
                                  onChange={() => handleQuestionAnswer(question.id, false)}
                                  className="text-emerald-600"
                                />
                                <Label htmlFor={`question-${question.id}-no`}>No</Label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevTab}>
                  Back
                </Button>
                <Button onClick={handleGenerateQuote}>Generate Quote</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quote Results</CardTitle>
                <CardDescription>
                  Eligible insurance plans for {clientData.firstName} {clientData.lastName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {quoteResults && (
                  <>
                    <div className="flex items-center space-x-2 text-lg font-medium">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span>Eligible Plans ({quoteResults.eligiblePlans.length})</span>
                    </div>

                    {Object.entries(groupedEligiblePlans || {}).map(([company, plans]) => (
                      <div key={company} className="space-y-3">
                        <h3 className="font-semibold text-lg border-b pb-2">{company}</h3>
                        <div className="space-y-3">
                          {plans.map((plan) => (
                            <div
                              key={plan.id}
                              className="flex justify-between items-center p-3 border rounded-md hover:bg-slate-50"
                            >
                              <div>
                                <div className="font-medium">{plan.name}</div>
                                <div className="text-sm text-muted-foreground">Type: {plan.planType}</div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-green-600">{plan.reason}</span>
                                <Button size="sm">Select</Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="mt-8 pt-4 border-t">
                      <div className="flex items-center space-x-2 text-lg font-medium">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <span>Ineligible Plans ({quoteResults.ineligiblePlans.length})</span>
                      </div>
                      <div className="mt-3 space-y-3">
                        {quoteResults.ineligiblePlans.map((plan) => (
                          <div
                            key={plan.id}
                            className="flex justify-between items-center p-3 border rounded-md bg-slate-50"
                          >
                            <div>
                              <div className="font-medium">{plan.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {plan.company} - {plan.planType}
                              </div>
                            </div>
                            <div className="text-sm text-red-600 max-w-md text-right">{plan.reason}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {!quoteResults && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No Quote Results</h3>
                    <p className="text-muted-foreground mt-2">Complete the previous steps to generate a quote</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevTab}>
                  Back
                </Button>
                <Button>Save Quote</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarNav>
  )
}
