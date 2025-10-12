import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type SortField = 'date' | 'title' | 'status' | 'rating' | 'company' | 'position' | 'word' | 'mastery';
export type SortOrder = 'asc' | 'desc';

interface SortControlsProps {
  fields: Array<{ value: SortField; label: string }>;
  currentField: SortField;
  currentOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

export const SortControls = ({ fields, currentField, currentOrder, onSortChange }: SortControlsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-card rounded-lg border border-border">
      <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
      {fields.map((field) => (
        <Button
          key={field.value}
          variant={currentField === field.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            if (currentField === field.value) {
              onSortChange(field.value, currentOrder === 'asc' ? 'desc' : 'asc');
            } else {
              onSortChange(field.value, 'desc');
            }
          }}
          className="gap-1"
        >
          {field.label}
          {currentField === field.value && (
            currentOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
          )}
          {currentField !== field.value && <ArrowUpDown className="h-3 w-3 opacity-40" />}
        </Button>
      ))}
    </div>
  );
};
