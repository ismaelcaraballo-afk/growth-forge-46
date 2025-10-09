import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export const SearchBar = ({ value, onChange, onClear }: SearchBarProps) => {
  return (
    <div className="flex gap-2 items-center">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2.5 border rounded-xl bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {value && (
        <button 
          onClick={onClear} 
          className="px-4 py-2.5 border rounded-xl border-border hover:bg-muted transition-colors flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Clear
        </button>
      )}
    </div>
  );
};
