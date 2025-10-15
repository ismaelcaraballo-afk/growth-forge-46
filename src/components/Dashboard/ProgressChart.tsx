import { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { DashboardData } from '@/types';

interface ProgressChartProps {
  data: DashboardData;
}

export const ProgressChart = ({ data }: ProgressChartProps) => {
  const monthlyData = useMemo(() => {
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const booksCompleted = data.books.filter(
        b => b.status === 'completed' && b.dateAdded?.startsWith(monthKey)
      ).length;
      const jobsApplied = data.jobs.filter(
        j => j.dateAdded?.startsWith(monthKey)
      ).length;
      const wordsAdded = data.vocab.filter(
        v => v.dateAdded?.startsWith(monthKey)
      ).length;
      
      last6Months.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        books: booksCompleted,
        jobs: jobsApplied,
        words: wordsAdded
      });
    }
    return last6Months;
  }, [data]);

  const maxValue = Math.max(
    ...monthlyData.flatMap(d => [d.books, d.jobs, d.words]),
    1
  );

  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg border border-border animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold text-foreground">6-Month Progress</h3>
      </div>
      <div className="space-y-6">
        {monthlyData.map((month, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                {month.month}
              </span>
              <div className="flex gap-4 text-xs">
                <span className="text-blue-500 font-medium">📚 {month.books}</span>
                <span className="text-green-500 font-medium">💼 {month.jobs}</span>
                <span className="text-purple-500 font-medium">🌍 {month.words}</span>
              </div>
            </div>
            <div className="flex gap-1 h-8 bg-accent/30 rounded-lg overflow-hidden">
              {month.books > 0 && (
                <div 
                  className="bg-blue-500 rounded transition-all hover:brightness-110" 
                  style={{ width: `${(month.books / maxValue) * 100}%` }} 
                  title={`${month.books} books`}
                />
              )}
              {month.jobs > 0 && (
                <div 
                  className="bg-green-500 rounded transition-all hover:brightness-110" 
                  style={{ width: `${(month.jobs / maxValue) * 100}%` }} 
                  title={`${month.jobs} jobs`}
                />
              )}
              {month.words > 0 && (
                <div 
                  className="bg-purple-500 rounded transition-all hover:brightness-110" 
                  style={{ width: `${(month.words / maxValue) * 100}%` }} 
                  title={`${month.words} words`}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-muted-foreground">Books</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-muted-foreground">Jobs</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span className="text-muted-foreground">Words</span>
        </div>
      </div>
    </div>
  );
};
