"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/store/hooks";
import { UserRole } from "@/store/interfaces/user";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export const RouteGuard = ({ 
  children, 
  allowedRoles,
  redirectTo = "/"
}: RouteGuardProps) => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, checkAuth } = useAuth();

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        if (token && !isAuthenticated) {
          await checkAuth();
        }
      }
    };

    initAuth();
  }, [checkAuth, isAuthenticated]);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user && !allowedRoles.includes(user.role)) {
      // Redirigir según el rol del usuario
      const userRole = user.role;
      if (userRole === "admin") {
        router.push("/admin");
      } else if (userRole === "recepcionista") {
        router.push("/recepcion");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, isAuthenticated, isLoading, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};
