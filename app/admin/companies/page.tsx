"use client"

import { useState, useEffect } from "react"
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
import { Plus, Pencil, Trash2, Loader2, AlertCircle } from "lucide-react"
import { adminNavItems } from "@/lib/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentCompany, setCurrentCompany] = useState(null)
  const [newCompany, setNewCompany] = useState({ name: "", active: true })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadCompanies() {
      try {
        setError(null)
        setIsLoading(true)

        // Use a timeout to ensure we don't get stuck in a loading state
        const timeoutId = setTimeout(() => {
          setIsLoading(false)
          setError("Request timed out. Please try again.")
        }, 10000)

        const response = await fetch("/api/companies")
        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Server responded with status: ${response.status}`)
        }

        const data = await response.json()
        setCompanies(data)
      } catch (error) {
        console.error("Error loading companies:", error)
        setError(error.message || "Failed to load companies. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadCompanies()
  }, [])

  const handleAddCompany = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCompany),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server responded with status: ${response.status}`)
      }

      const company = await response.json()
      setCompanies([...companies, company])
      setNewCompany({ name: "", active: true })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error adding company:", error)
      setError(error.message || "Failed to add company. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditCompany = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch(`/api/companies/${currentCompany.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentCompany),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server responded with status: ${response.status}`)
      }

      const updated = await response.json()
      setCompanies(companies.map((company) => (company.id === currentCompany.id ? updated : company)))
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Error updating company:", error)
      setError(error.message || "Failed to update company. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCompany = async (id) => {
    if (confirm("Are you sure you want to delete this company? This action cannot be undone.")) {
      try {
        setError(null)

        const response = await fetch(`/api/companies/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Server responded with status: ${response.status}`)
        }

        setCompanies(companies.filter((company) => company.id !== id))
      } catch (error) {
        console.error("Error deleting company:", error)
        setError(error.message || "Failed to delete company. Please try again.")
      }
    }
  }

  // For debugging purposes - temporary solution
  const checkApiStatus = async () => {
    try {
      setError(null)
      setIsLoading(true)

      const response = await fetch("/api/db-status")
      const data = await response.json()

      alert(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error("Error checking API status:", error)
      setError(error.message || "Failed to check API status")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SidebarNav items={adminNavItems} title="Admin">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Companies</CardTitle>
            <CardDescription>Manage insurance companies in the system</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={checkApiStatus} disabled={isLoading}>
              Check API Status
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Company
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Company</DialogTitle>
                  <DialogDescription>Enter the details for the new insurance company</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Company Name</Label>
                    <Input
                      id="name"
                      value={newCompany.name}
                      onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={newCompany.active}
                      onCheckedChange={(checked) => setNewCompany({ ...newCompany, active: checked })}
                    />
                    <Label htmlFor="active">Active</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCompany} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      {error ? "Error loading companies" : "No companies found. Add your first company to get started."}
                    </TableCell>
                  </TableRow>
                ) : (
                  companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>{company.name}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            company.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {company.active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog
                          open={isEditDialogOpen && currentCompany?.id === company.id}
                          onOpenChange={(open) => {
                            setIsEditDialogOpen(open)
                            if (!open) setCurrentCompany(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setCurrentCompany(company)}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Company</DialogTitle>
                              <DialogDescription>Update the company details</DialogDescription>
                            </DialogHeader>
                            {currentCompany && (
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-name">Company Name</Label>
                                  <Input
                                    id="edit-name"
                                    value={currentCompany.name}
                                    onChange={(e) =>
                                      setCurrentCompany({
                                        ...currentCompany,
                                        name: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id="edit-active"
                                    checked={currentCompany.active}
                                    onCheckedChange={(checked) =>
                                      setCurrentCompany({
                                        ...currentCompany,
                                        active: checked,
                                      })
                                    }
                                  />
                                  <Label htmlFor="edit-active">Active</Label>
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                                disabled={isSubmitting}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleEditCompany} disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCompany(company.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </SidebarNav>
  )
}
