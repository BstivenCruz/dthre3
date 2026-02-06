"use client";

import LayoutClient from "@/components/layout/layoutClient/layoutClient";
import { RouteGuard } from "@/components/functional/route-guard";
import { recepcionistaNavigation } from "@/data/menu";

export default function RecepcionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allowedRoles={["recepcionista"]}>
      <LayoutClient navigation={recepcionistaNavigation}>
        {children}
      </LayoutClient>
    </RouteGuard>
  );
}
