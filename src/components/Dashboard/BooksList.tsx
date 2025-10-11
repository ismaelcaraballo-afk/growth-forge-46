import { useState } from 'react';
import { Book, Pencil, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookItem } from '@/types';

interface BooksListProps {
  books: BookItem[];
  onEdit: (book: BookItem) => void;
  onDelete: (id: string | number) => void;
}

export const BooksList = ({ books, onEdit, onDelete }: BooksListProps) => {
  const getStatusColor = (status: string) => {
    if (status === 'completed') return 'bg-success/10 text-success border-success/20';
    if (status === 'reading') return 'bg-primary/10 text-primary border-primary/20';
    return 'bg-muted text-muted-foreground';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted'}`}
      />
    ));
  };

  if (books.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Book className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-lg font-semibold text-foreground mb-2">No books yet</p>
        <p className="text-muted-foreground">Add your first book to start tracking!</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {books.map((book) => (
        <Card key={book.id} className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1 w-full">
              <div className="flex items-start gap-3 mb-2">
                <Book className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1 break-words">{book.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground break-words">{book.author}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3 mb-3">
                <Badge className={getStatusColor(book.status)}>
                  {book.status}
                </Badge>
                <Badge variant="outline">{book.pages} pages</Badge>
                {book.tags?.map((tag, i) => (
                  <Badge key={i} variant="secondary">{tag}</Badge>
                ))}
              </div>

              <div className="flex items-center gap-1 mt-2">
                {renderStars(book.rating)}
              </div>
              
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Added: {new Date(book.dateAdded).toLocaleDateString()}
              </p>
            </div>

            <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(book)}
                className="hover:bg-primary/10 flex-1 sm:flex-none"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(book.id)}
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
