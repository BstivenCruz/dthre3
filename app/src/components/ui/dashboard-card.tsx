import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./card";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  color?: "primary" | "success" | "warning" | "info";
  progress?: number; // 0-100 para barra de progreso
}

const colorClasses = {
  primary: {
    icon: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    gradient: "from-primary/20 to-primary/5",
  },
  success: {
    icon: "text-success",
    bg: "bg-success/10",
    border: "border-success/20",
    gradient: "from-success/20 to-success/5",
  },
  warning: {
    icon: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
    gradient: "from-warning/20 to-warning/5",
  },
  info: {
    icon: "text-info",
    bg: "bg-info/10",
    border: "border-info/20",
    gradient: "from-info/20 to-info/5",
  },
};

export const DashboardCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "primary",
  progress,
}: DashboardCardProps) => {
  const colors = colorClasses[color];

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-150 hover:shadow-sm",
      colors.border && "border-2"
    )}>
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-150",
        colors.gradient
      )} />
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight transition-transform duration-150 group-hover:scale-105">
              {value}
            </p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
            {progress !== undefined && (
              <div className="pt-2">
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      color === "primary" && "bg-primary",
                      color === "success" && "bg-success",
                      color === "warning" && "bg-warning",
                      color === "info" && "bg-info"
                    )}
                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className={cn(
            "h-14 w-14 rounded-xl flex items-center justify-center transition-all duration-150 group-hover:scale-105",
            colors.bg,
            colors.icon
          )}>
            <Icon className="h-7 w-7" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
