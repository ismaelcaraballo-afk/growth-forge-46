import { useState } from 'react';
import { Sparkles, BookOpen, Briefcase, Languages, TrendingUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { DashboardData } from '@/types';

interface AIInsightsProps {
  data: DashboardData;
  currentTab: 'dash' | 'reading' | 'career' | 'language';
}

export const AIInsights = ({ data, currentTab }: AIInsightsProps) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInsightType = () => {
    if (currentTab === 'reading') return 'books';
    if (currentTab === 'career') return 'career';
    if (currentTab === 'language') return 'vocabulary';
    return 'overview';
  };

  const getInsightData = () => {
    if (currentTab === 'reading') return data.books;
    if (currentTab === 'career') return data.jobs;
    if (currentTab === 'language') return data.vocab;
    return data;
  };

  const getIcon = () => {
    if (currentTab === 'reading') return BookOpen;
    if (currentTab === 'career') return Briefcase;
    if (currentTab === 'language') return Languages;
    return TrendingUp;
  };

  const getTitle = () => {
    if (currentTab === 'reading') return 'Book Recommendations';
    if (currentTab === 'career') return 'Career Insights';
    if (currentTab === 'language') return 'Learning Tips';
    return 'Personal Growth Insights';
  };

  const getGradient = () => {
    if (currentTab === 'reading') return 'gradient-blue';
    if (currentTab === 'career') return 'gradient-green';
    if (currentTab === 'language') return 'gradient-purple';
    return 'gradient-orange';
  };

  const generateInsights = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: result, error: functionError } = await supabase.functions.invoke('ai-insights', {
        body: {
          type: getInsightType(),
          data: getInsightData()
        }
      });

      if (functionError) {
        throw new Error(functionError.message || 'Failed to generate insights');
      }

      if (result?.error) {
        throw new Error(result.error);
      }

      setInsight(result.insight);
    } catch (err) {
      console.error('Error generating insights:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate insights');
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = getIcon();

  return (
    <Card className="p-6 shadow-lg border-2 border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <div className={`${getGradient()} p-3 rounded-xl`}>
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">AI-Powered {getTitle()}</h3>
          <p className="text-sm text-muted-foreground">Get personalized suggestions based on your data</p>
        </div>
      </div>

      {!insight && !isLoading && (
        <Button
          onClick={generateInsights}
          className={`w-full ${getGradient()} text-white hover:scale-105 transition-transform`}
          size="lg"
        >
          <Icon className="h-5 w-5 mr-2" />
          Generate AI Insights
        </Button>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Analyzing your data...</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
          <p className="text-destructive font-medium">{error}</p>
          <Button
            onClick={generateInsights}
            variant="outline"
            size="sm"
            className="mt-3"
          >
            Try Again
          </Button>
        </div>
      )}

      {insight && !isLoading && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-foreground">{insight}</div>
            </div>
          </div>
          <Button
            onClick={generateInsights}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate New Insights
          </Button>
        </div>
      )}
    </Card>
  );
};
