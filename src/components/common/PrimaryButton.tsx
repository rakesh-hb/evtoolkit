import React from "react";

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function PrimaryButton({
  children,
  className = "",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      {...props}
      className={`rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white shadow transition hover:bg-blue-700 active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}