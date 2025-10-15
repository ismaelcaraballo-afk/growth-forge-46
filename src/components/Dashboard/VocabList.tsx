import { Languages, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { VocabItem } from '@/types';

interface VocabListProps {
  vocab: VocabItem[];
  onEdit: (vocab: VocabItem) => void;
  onDelete: (id: string | number) => void;
  selectedItems?: string[];
  onSelectItem?: (id: string, selected: boolean) => void;
}

export const VocabList = ({ vocab, onEdit, onDelete, selectedItems = [], onSelectItem }: VocabListProps) => {
  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return 'text-success';
    if (mastery >= 50) return 'text-primary';
    return 'text-destructive';
  };

  if (vocab.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Languages className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-lg font-semibold text-foreground mb-2">No vocabulary yet</p>
        <p className="text-muted-foreground">Add your first word to start learning!</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {vocab.map((item) => (
        <Card key={item.id} className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex items-start gap-3 flex-1 w-full">
              {onSelectItem && (
                <input
                  type="checkbox"
                  checked={selectedItems.includes(`vocab-${item.id}`)}
                  onChange={(e) => onSelectItem(`vocab-${item.id}`, e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 cursor-pointer"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 mb-3">
                  <Languages className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-1">
                      <h3 className="text-lg sm:text-xl font-bold text-foreground break-words">{item.word}</h3>
                      <Badge variant="outline">{item.lang}</Badge>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground break-words">{item.trans}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm text-muted-foreground">Mastery:</span>
                    <span className={`text-xs sm:text-sm font-semibold ${getMasteryColor(item.mastery)}`}>
                      {item.mastery}%
                    </span>
                  </div>
                  <Progress value={item.mastery} className="h-2" />
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {item.tags?.map((tag, i) => (
                    <Badge key={i} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                
                <p className="text-xs sm:text-sm text-muted-foreground mt-3">
                  Added: {new Date(item.dateAdded).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(item)}
                className="hover:bg-primary/10 flex-1 sm:flex-none"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(item.id)}
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
