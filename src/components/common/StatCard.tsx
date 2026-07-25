import React from "react";
import Card from "./Card";

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
}

export default function StatCard({
  title,
  value,
 subtitle,
  icon,
}: StatCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}