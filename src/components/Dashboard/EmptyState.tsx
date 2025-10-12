import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-card rounded-2xl border border-border">
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Icon className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-md">{description}</p>
      <Button onClick={onAction} className="gradient-blue text-white">
        {actionLabel}
      </Button>
    </div>
  );
};
