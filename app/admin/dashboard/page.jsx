import Link from "next/link"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, FileText, Stethoscope, Pill, ShieldCheck, Database } from "lucide-react"
import { companies, plans, healthConditions, medications } from "@/lib/mock-data"
import { adminNavItems } from "@/lib/navigation"

export default function AdminDashboard() {
  return (
    <SidebarNav items={adminNavItems} title="Admin">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.length}</div>
            <p className="text-xs text-muted-foreground">Insurance companies in the system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plans</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.length}</div>
            <p className="text-xs text-muted-foreground">Insurance plans available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Conditions</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthConditions.length}</div>
            <p className="text-xs text-muted-foreground">Health conditions tracked</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medications</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medications.length}</div>
            <p className="text-xs text-muted-foreground">Medications in database</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>System activity in the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">New plan added: Secure Health Plus</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Updated eligibility rules for LifeGuard Immediate</p>
                  <p className="text-sm text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Added 3 new health conditions</p>
                  <p className="text-sm text-muted-foreground">Yesterday</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Frequently accessed pages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Link href="/admin/companies" className="flex items-center p-2 rounded-md hover:bg-muted">
                <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Manage Companies</span>
              </Link>
              <Link href="/admin/plans" className="flex items-center p-2 rounded-md hover:bg-muted">
                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Manage Plans</span>
              </Link>
              <Link href="/admin/rules" className="flex items-center p-2 rounded-md hover:bg-muted">
                <ShieldCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Manage Eligibility Rules</span>
              </Link>
              <Link href="/admin/conditions" className="flex items-center p-2 rounded-md hover:bg-muted">
                <Stethoscope className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Manage Health Conditions</span>
              </Link>
              <Link href="/admin/database-setup" className="flex items-center p-2 rounded-md hover:bg-muted">
                <Database className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Database Setup</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarNav>
  )
}
