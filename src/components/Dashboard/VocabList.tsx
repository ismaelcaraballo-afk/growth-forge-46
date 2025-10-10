import { Languages, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { VocabItem } from '@/types';

interface VocabListProps {
  vocab: VocabItem[];
  onEdit: (vocab: VocabItem) => void;
  onDelete: (id: number) => void;
}

export const VocabList = ({ vocab, onEdit, onDelete }: VocabListProps) => {
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
        <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-3">
                <Languages className="h-5 w-5 text-purple-500 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-foreground">{item.word}</h3>
                    <Badge variant="outline">{item.lang}</Badge>
                  </div>
                  <p className="text-muted-foreground">{item.trans}</p>
                </div>
              </div>
              
              <div className="space-y-2 mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Mastery:</span>
                  <span className={`text-sm font-semibold ${getMasteryColor(item.mastery)}`}>
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
              
              <p className="text-sm text-muted-foreground mt-3">
                Added: {new Date(item.dateAdded).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(item)}
                className="hover:bg-primary/10"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(item.id)}
                className="hover:bg-destructive/10 hover:text-destructive"
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
