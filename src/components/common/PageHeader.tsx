import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  icon,
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/15 text-3xl">
              {icon}
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold">{title}</h1>

            {subtitle && (
              <p className="mt-1 text-sm text-blue-100">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {action}
      </div>
    </div>
  );
}