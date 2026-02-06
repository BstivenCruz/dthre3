"use client";

import { useRouter, usePathname } from "next/navigation";
import { LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { NavigationItem } from "@/data/menu";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  Sidebar as UISidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

import { useAuth } from "@/store/hooks";

const SidebarUserInfo = () => {
  const { user } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const getUserInitials = () => {
    if (!user?.name) return "U";
    const nameParts = user.name.trim().split(" ");
    const firstInitial = nameParts[0]?.charAt(0).toUpperCase() || "";
    const lastInitial = nameParts[1]?.charAt(0).toUpperCase() || "";
    return firstInitial + lastInitial || "U";
  };

  if (isCollapsed) {
    return (
      <div className="flex justify-center py-3 border-t border-sidebar-border">
        <div className="group relative">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
            <AvatarImage alt={user?.name || "Usuario"} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold text-sm shadow-md">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 py-4 border-t border-sidebar-border rounded-lg bg-gradient-to-br from-sidebar-accent/50 to-sidebar-accent/30 mb-3 transition-all duration-300 hover:from-sidebar-accent/60 hover:to-sidebar-accent/40 group">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-11 w-11 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300 group-hover:scale-105">
            <AvatarImage alt={user?.name || "Usuario"} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold shadow-md">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-sidebar-background"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <UserIcon className="h-3.5 w-3.5 text-sidebar-foreground/50 group-hover:text-primary transition-colors" />
            <p className="text-sm font-semibold text-sidebar-foreground truncate group-hover:text-primary transition-colors">
              {user?.name || "Usuario"}
            </p>
          </div>
          <p className="text-xs text-sidebar-foreground/70 truncate mt-1.5 ml-5">
            {user?.email}
          </p>
        </div>
      </div>
    </div>
  );
};

const SidebarLogoutButton = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <Button
      variant="ghost"
      className={`w-full text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-all duration-300 group ${
        isCollapsed ? "justify-center px-2" : "justify-start gap-x-3"
      }`}
      onClick={handleLogout}
      title="Cerrar Sesión"
    >
      <LogOut className="h-5 w-5 shrink-0 group-hover:rotate-12 transition-transform duration-300" />
      {!isCollapsed && (
        <span className="font-medium group-hover:translate-x-1 transition-transform duration-300 inline-block">
          Cerrar Sesión
        </span>
      )}
    </Button>
  );
};

const NavigationItemComponent = ({ item, isActive }: { item: NavigationItem, isActive: boolean }) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  // Asegurar que el icono siempre tenga color cuando está activo, especialmente cuando está colapsado
  const iconClassName = isActive
    ? "h-5 w-5 shrink-0 transition-all duration-200 text-primary opacity-100"
    : "h-5 w-5 shrink-0 transition-all duration-200 text-sidebar-foreground/70 group-hover/menu:text-sidebar-foreground";

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.name}
        className="group/menu transition-all duration-200"
      >
        <Link href={item.href} className="flex items-center gap-2">
          <item.icon className={`${iconClassName} group-hover/menu:scale-110`} style={isActive ? { color: 'hsl(var(--primary))' } : undefined} />
          <span className="transition-colors duration-200 group-hover/menu:text-sidebar-primary-foreground group-data-[collapsible=icon]:hidden">
            {item.name}
          </span>
          {isActive && !isCollapsed && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-primary" />
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const LayoutClient = ({ 
  children, 
  navigation 
}: { 
  children: React.ReactNode;
  navigation: NavigationItem[];
}) => {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <UISidebar collapsible="icon" variant="sidebar">
        <SidebarHeader>
          <div className="flex h-20 shrink-0 items-center justify-center pt-4 pb-2">
            <div className="relative w-32 h-32 mx-auto group">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              <div className="relative w-full h-full transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo_blanco.png"
                  alt="D-thre3 Logo"
                  fill
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <NavigationItemComponent key={item.name} item={item} isActive={isActive} />
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarUserInfo />
              <Separator className="my-2 bg-sidebar-border/50" />
              <SidebarLogoutButton />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>
        <SidebarRail />
      </UISidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
          <SidebarTrigger className="transition-all duration-200 hover:bg-primary/10 hover:text-primary" />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-muted-foreground truncate">
              {navigation.find((item) => item.href === pathname)?.name ||
                "Dashboard"}
            </h2>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8 animate-fade-in">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default LayoutClient;
