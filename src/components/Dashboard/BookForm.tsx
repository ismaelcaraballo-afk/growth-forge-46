import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { BookItem } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BookFormProps {
  book?: BookItem;
  onSave: (book: Omit<BookItem, 'id'> & { id?: string | number }) => void;
  onCancel: () => void;
}

export const BookForm = ({ book, onSave, onCancel }: BookFormProps) => {
  const [title, setTitle] = useState(book?.title || '');
  const [author, setAuthor] = useState(book?.author || '');
  const [pages, setPages] = useState(book?.pages?.toString() || '');
  const [status, setStatus] = useState(book?.status || 'reading');
  const [rating, setRating] = useState(book?.rating?.toString() || '0');
  const [tags, setTags] = useState(book?.tags?.join(', ') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(book?.id && { id: book.id }),
      title,
      author,
      pages: parseInt(pages) || 0,
      status,
      rating: parseInt(rating) || 0,
      dateAdded: book?.dateAdded || new Date().toISOString(),
      tags: tags.split(',').map(t => t.trim()).filter(t => t)
    });
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-foreground">
          {book ? 'Edit Book' : 'Add New Book'}
        </h3>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Book title"
            />
          </div>
          <div>
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              placeholder="Author name"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="pages">Pages</Label>
            <Input
              id="pages"
              type="number"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              placeholder="300"
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(v: any) => setStatus(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reading">Reading</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="wishlist">Wishlist</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="rating">Rating (0-5)</Label>
            <Input
              id="rating"
              type="number"
              min="0"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="fiction, thriller, bestseller"
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="gradient-blue text-white flex-1">
            {book ? 'Update Book' : 'Add Book'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};
