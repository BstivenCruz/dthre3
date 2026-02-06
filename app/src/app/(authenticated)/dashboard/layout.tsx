"use client";

import LayoutClient from "@/components/layout/layoutClient/layoutClient";
import { RouteGuard } from "@/components/functional/route-guard";
import { studentNavigation } from "@/data/menu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allowedRoles={["estudiante"]}>
      <LayoutClient navigation={studentNavigation}>
        {children}
      </LayoutClient>
    </RouteGuard>
  );
}
