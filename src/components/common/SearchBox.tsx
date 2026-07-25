interface SearchBoxProps {
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
  }
  
  export default function SearchBox({
    value,
    onChange,
    placeholder = "Search...",
  }: SearchBoxProps) {
    return (
      <div className="mb-6">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>
    );
  }