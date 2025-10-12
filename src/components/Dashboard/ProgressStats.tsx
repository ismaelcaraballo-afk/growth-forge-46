import { Progress } from '@/components/ui/progress';
import { DashboardData } from '@/types';
import { BookOpen, Briefcase, Languages, TrendingUp } from 'lucide-react';

interface ProgressStatsProps {
  data: DashboardData;
}

export const ProgressStats = ({ data }: ProgressStatsProps) => {
  const booksCompleted = data.books.filter(b => b.status === 'completed').length;
  const booksTotal = data.books.length;
  const booksProgress = booksTotal > 0 ? (booksCompleted / booksTotal) * 100 : 0;

  const jobsActive = data.jobs.filter(j => ['applied', 'interview'].includes(j.status)).length;
  const jobsTotal = data.jobs.length;
  const jobsProgress = jobsTotal > 0 ? (jobsActive / jobsTotal) * 100 : 0;

  const avgMastery = data.vocab.length > 0 
    ? data.vocab.reduce((sum, v) => sum + v.mastery, 0) / data.vocab.length 
    : 0;

  const highMasteryWords = data.vocab.filter(v => v.mastery >= 75).length;

  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg border border-border space-y-6">
      <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        Progress Overview
      </h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">Reading Progress</span>
            </div>
            <span className="text-muted-foreground">{booksCompleted} / {booksTotal} books</span>
          </div>
          <Progress value={booksProgress} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-success" />
              <span className="font-medium text-foreground">Active Applications</span>
            </div>
            <span className="text-muted-foreground">{jobsActive} / {jobsTotal} jobs</span>
          </div>
          <Progress value={jobsProgress} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-purple-500" />
              <span className="font-medium text-foreground">Vocabulary Mastery</span>
            </div>
            <span className="text-muted-foreground">{Math.round(avgMastery)}% average</span>
          </div>
          <Progress value={avgMastery} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {highMasteryWords} words with 75%+ mastery
          </p>
        </div>
      </div>
    </div>
  );
};
