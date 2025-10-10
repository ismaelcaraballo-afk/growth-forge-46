import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { VocabItem } from '@/types';
import { Slider } from '@/components/ui/slider';

interface VocabFormProps {
  vocab?: VocabItem;
  onSave: (vocab: Omit<VocabItem, 'id'> & { id?: number }) => void;
  onCancel: () => void;
}

export const VocabForm = ({ vocab, onSave, onCancel }: VocabFormProps) => {
  const [word, setWord] = useState(vocab?.word || '');
  const [trans, setTrans] = useState(vocab?.trans || '');
  const [lang, setLang] = useState(vocab?.lang || '');
  const [mastery, setMastery] = useState(vocab?.mastery || 50);
  const [tags, setTags] = useState(vocab?.tags?.join(', ') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(vocab?.id && { id: vocab.id }),
      word,
      trans,
      lang,
      mastery,
      dateAdded: vocab?.dateAdded || new Date().toISOString(),
      tags: tags.split(',').map(t => t.trim()).filter(t => t)
    });
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-foreground">
          {vocab ? 'Edit Vocabulary' : 'Add New Vocabulary'}
        </h3>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="word">Word/Phrase *</Label>
            <Input
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              required
              placeholder="Word or phrase"
            />
          </div>
          <div>
            <Label htmlFor="trans">Translation *</Label>
            <Input
              id="trans"
              value={trans}
              onChange={(e) => setTrans(e.target.value)}
              required
              placeholder="English translation"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="lang">Language *</Label>
          <Input
            id="lang"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            required
            placeholder="Spanish, French, etc."
          />
        </div>

        <div>
          <Label htmlFor="mastery">Mastery Level: {mastery}%</Label>
          <Slider
            id="mastery"
            value={[mastery]}
            onValueChange={(v) => setMastery(v[0])}
            max={100}
            step={5}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="verbs, food, travel"
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="gradient-purple text-white flex-1">
            {vocab ? 'Update Vocabulary' : 'Add Vocabulary'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};
