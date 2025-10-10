import { Briefcase, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JobItem } from '@/types';

interface JobsListProps {
  jobs: JobItem[];
  onEdit: (job: JobItem) => void;
  onDelete: (id: number) => void;
}

export const JobsList = ({ jobs, onEdit, onDelete }: JobsListProps) => {
  const getStatusColor = (status: string) => {
    if (status === 'interview') return 'bg-success/10 text-success border-success/20';
    if (status === 'applied') return 'bg-primary/10 text-primary border-primary/20';
    if (status === 'offer') return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    return 'bg-destructive/10 text-destructive border-destructive/20';
  };

  if (jobs.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-lg font-semibold text-foreground mb-2">No job applications yet</p>
        <p className="text-muted-foreground">Add your first application to start tracking!</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <Card key={job.id} className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1 w-full">
              <div className="flex items-start gap-3 mb-2">
                <Briefcase className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1 break-words">{job.position}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground break-words">{job.company}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className={getStatusColor(job.status)}>
                  {job.status}
                </Badge>
                {job.tags?.map((tag, i) => (
                  <Badge key={i} variant="secondary">{tag}</Badge>
                ))}
              </div>
              
              <p className="text-xs sm:text-sm text-muted-foreground mt-3">
                Applied: {new Date(job.dateAdded).toLocaleDateString()}
              </p>
            </div>

            <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(job)}
                className="hover:bg-primary/10 flex-1 sm:flex-none"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(job.id)}
                className="hover:bg-destructive/10 hover:text-destructive flex-1 sm:flex-none"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
