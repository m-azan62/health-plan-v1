import Link from "next/link"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, FileText, Users, BarChart, Settings, ArrowRight } from "lucide-react"

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

export default function AgentDashboard() {
  return (
    <SidebarNav items={agentNavItems} title="Agent">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.3%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+12 new clients this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Premium</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,284</div>
            <p className="text-xs text-muted-foreground">+$124 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Quotes</CardTitle>
            <CardDescription>Your most recent client quotes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 text-sm font-medium text-muted-foreground">
                <div>Client</div>
                <div>Date</div>
                <div>Status</div>
              </div>
              <div className="grid grid-cols-3 items-center">
                <div>John Smith</div>
                <div className="text-sm text-muted-foreground">May 3, 2025</div>
                <div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Completed
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 items-center">
                <div>Sarah Johnson</div>
                <div className="text-sm text-muted-foreground">May 2, 2025</div>
                <div>
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                    Pending
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 items-center">
                <div>Michael Brown</div>
                <div className="text-sm text-muted-foreground">May 1, 2025</div>
                <div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Completed
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 items-center">
                <div>Emily Davis</div>
                <div className="text-sm text-muted-foreground">April 30, 2025</div>
                <div>
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                    Declined
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button asChild className="w-full justify-between">
                <Link href="/agent/quote">
                  Start New Quote <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-between">
                <Link href="/agent/clients">
                  View Clients <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-between">
                <Link href="/agent/reports">
                  Generate Report <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarNav>
  )
}
