import { 
  Calendar, 
  FileText, 
  LayoutDashboard, 
  Package,
  BookOpen,
  Users,
  Settings,
  ClipboardList
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { UserRole } from "@/store/interfaces/user";

export type NavigationItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

export const studentNavigation: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Calendario", href: "/dashboard/calendar", icon: Calendar },
  { name: "Paquetes", href: "/dashboard/packages", icon: Package },
  { name: "Registro", href: "/dashboard/record", icon: FileText },
];

export const adminNavigation: NavigationItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Clases", href: "/admin/classes", icon: BookOpen },
  { name: "Reportes", href: "/admin/reportes", icon: FileText },
  { name: "Usuarios", href: "/admin/usuarios", icon: Users },
  { name: "Configuración", href: "/admin/config", icon: Settings },
];

export const recepcionistaNavigation: NavigationItem[] = [
  { name: "Dashboard", href: "/recepcion", icon: LayoutDashboard },
  { name: "Calendario", href: "/recepcion/calendar", icon: Calendar },
  { name: "Asistencias", href: "/recepcion/asistencias", icon: ClipboardList },
  { name: "Estudiantes", href: "/recepcion/estudiantes", icon: Users },
];

// Mantener compatibilidad con código existente (deprecated)
export const navigation = studentNavigation;

export const getNavigationByRole = (role: UserRole): NavigationItem[] => {
  switch (role) {
    case "admin":
      return adminNavigation;
    case "recepcionista":
      return recepcionistaNavigation;
    case "estudiante":
    default:
      return studentNavigation;
  }
};
