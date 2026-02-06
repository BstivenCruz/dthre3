import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./card";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  color?: "primary" | "yellow" | "green" | "blue";
  animate?: boolean;
  progress?: number; // 0-100 para barra de progreso
}

const colorClasses = {
  primary: {
    icon: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    gradient: "from-primary/20 to-primary/5",
  },
  yellow: {
    icon: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    gradient: "from-yellow-500/20 to-yellow-500/5",
  },
  green: {
    icon: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    gradient: "from-green-500/20 to-green-500/5",
  },
  blue: {
    icon: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    gradient: "from-blue-500/20 to-blue-500/5",
  },
};

export const DashboardCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "primary",
  animate = false,
  progress,
}: DashboardCardProps) => {
  const colors = colorClasses[color];

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10",
      animate && "animate-pulse-glow",
      colors.border && "border-2"
    )}>
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        colors.gradient
      )} />
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight transition-transform duration-300 group-hover:scale-105">
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
                      color === "yellow" && "bg-yellow-500",
                      color === "green" && "bg-green-500",
                      color === "blue" && "bg-blue-500"
                    )}
                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className={cn(
            "h-14 w-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
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
