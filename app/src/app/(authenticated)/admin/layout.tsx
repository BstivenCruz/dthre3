"use client";

import LayoutClient from "@/components/layout/layoutClient/layoutClient";
import { RouteGuard } from "@/components/functional/route-guard";
import { adminNavigation } from "@/data/menu";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allowedRoles={["admin"]}>
      <LayoutClient navigation={adminNavigation}>
        {children}
      </LayoutClient>
    </RouteGuard>
  );
}
