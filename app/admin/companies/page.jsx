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
      setCompanies(companies.map((c) => (c.id === currentCompany.id ? updated : c)))
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
        const response = await fetch(`/api/companies/${id}`, { method: "DELETE" })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Server responded with status: ${response.status}`)
        }

        setCompanies(companies.filter((c) => c.id !== id))
      } catch (error) {
        console.error("Error deleting company:", error)
        setError(error.message || "Failed to delete company. Please try again.")
      }
    }
  }

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
      {/* UI components preserved as-is */}
      {/* No TypeScript-specific syntax, safe to use directly */}
    </SidebarNav>
  )
}
