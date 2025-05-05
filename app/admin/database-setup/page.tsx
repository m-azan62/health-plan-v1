"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react"
import { SidebarNav } from "@/components/sidebar-nav"
import { adminNavItems } from "@/lib/navigation"

export default function DatabaseSetupPage() {
  const [dbStatus, setDbStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [initLoading, setInitLoading] = useState(false)
  const [seedLoading, setSeedLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  const checkDatabaseStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/db-status")
      const data = await response.json()
      setDbStatus(data)
    } catch (error) {
      console.error("Error checking database status:", error)
      setDbStatus({ success: false, status: "error", error: "Failed to check database status" })
    } finally {
      setLoading(false)
    }
  }

  const initializeDatabase = async () => {
    setInitLoading(true)
    setMessage(null)
    try {
      const response = await fetch("/api/init-db", { method: "POST" })
      const data = await response.json()

      if (data.success) {
        setMessage({ type: "success", text: "Database schema initialized successfully!" })
      } else {
        setMessage({ type: "error", text: `Error: ${data.error}` })
      }

      // Refresh status
      await checkDatabaseStatus()
    } catch (error) {
      console.error("Error initializing database:", error)
      setMessage({ type: "error", text: "Failed to initialize database schema" })
    } finally {
      setInitLoading(false)
    }
  }

  const seedDatabase = async () => {
    setSeedLoading(true)
    setMessage(null)
    try {
      const response = await fetch("/api/seed", { method: "POST" })
      const data = await response.json()

      if (data.success) {
        setMessage({
          type: "success",
          text: `Database seeded successfully! Added ${data.data.companies} companies, ${data.data.conditions} conditions, ${data.data.medications} medications, ${data.data.plans} plans, ${data.data.questions} questions, and ${data.data.rules} rules.`,
        })
      } else {
        setMessage({ type: "error", text: `Error: ${data.error}` })
      }

      // Refresh status
      await checkDatabaseStatus()
    } catch (error) {
      console.error("Error seeding database:", error)
      setMessage({ type: "error", text: "Failed to seed database" })
    } finally {
      setSeedLoading(false)
    }
  }

  return (
    <SidebarNav items={adminNavItems} title="Admin">
      <h1 className="text-3xl font-bold mb-6">Database Setup</h1>

      {message && (
        <Alert className={`mb-6 ${message.type === "success" ? "bg-green-50" : "bg-red-50"}`}>
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertTitle>{message.type === "success" ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Connection Status</CardTitle>
            <CardDescription>Check if the application can connect to the PostgreSQL database</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span>Checking database connection...</span>
              </div>
            ) : dbStatus?.success ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Connected to database</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Server time: {new Date(dbStatus.timestamp).toLocaleString()}</p>
                </div>

                <div className="mt-4 space-y-2">
                  <h3 className="font-medium">Database Schema Status:</h3>
                  {dbStatus.database.tables.initialized ? (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Schema initialized</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <span>Schema not initialized. Missing tables: {dbStatus.database.tables.missing.join(", ")}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  <h3 className="font-medium">Database Data Status:</h3>
                  {dbStatus.database.data.hasData ? (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Data present ({dbStatus.database.data.companyCount} companies)</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <span>No data found</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span>Failed to connect to database: {dbStatus?.error}</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={checkDatabaseStatus} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Refresh Status
            </Button>
          </CardFooter>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Initialize Database Schema</CardTitle>
              <CardDescription>Create all required tables in the database</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                This will create all the necessary tables, indexes, and constraints in your PostgreSQL database based on
                the schema definition.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Note: This operation is safe to run multiple times. It will not delete existing data.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={initializeDatabase} disabled={initLoading || !dbStatus?.success}>
                {initLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Initialize Schema
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seed Database</CardTitle>
              <CardDescription>Populate the database with sample data</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                This will add sample companies, health conditions, medications, plans, questions, and eligibility rules
                to your database.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Note: This should only be run once on a fresh database to avoid duplicate data.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={seedDatabase}
                disabled={seedLoading || !dbStatus?.success || !dbStatus?.database?.tables?.initialized}
              >
                {seedLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Seed Database
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </SidebarNav>
  )
}
