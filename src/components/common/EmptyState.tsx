interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
  }
  
  export default function EmptyState({
    icon,
    title,
    description,
  }: EmptyStateProps) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <div className="mb-4 text-5xl">
          {icon}
        </div>
  
        <h2 className="text-xl font-semibold">
          {title}
        </h2>
  
        <p className="mt-2 text-slate-500">
          {description}
        </p>
      </div>
    );
  }