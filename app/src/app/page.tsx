"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/hooks";

export default function Home() {
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

    if (isAuthenticated && user) {
      const role = user.role;
      if (role === "admin") {
        router.push("/admin");
        return;
      }
      if (role === "recepcionista") {
        router.push("/recepcion");
        return;
      }
      router.push("/dashboard");
      return;
    }

    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [user, isAuthenticated, isLoading, router]);

  return null;
}
