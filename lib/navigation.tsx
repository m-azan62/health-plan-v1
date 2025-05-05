import {
  LayoutDashboard,
  Building2,
  FileText,
  Stethoscope,
  Pill,
  HelpCircle,
  ShieldCheck,
  Database,
} from "lucide-react"

export const adminNavItems = [
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
  {
    title: "Database Setup",
    href: "/admin/database-setup",
    icon: <Database className="h-5 w-5" />,
  },
]
