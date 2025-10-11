export interface Book {
  id: string | number;
  title: string;
  author: string;
  pages?: number;
  status: string;
  rating?: number;
  dateAdded: string;
  tags?: string[];
}

export interface Job {
  id: string | number;
  company: string;
  position: string;
  status: string;
  dateAdded: string;
  tags?: string[];
}

export interface Vocabulary {
  id: string | number;
  word: string;
  trans: string;
  lang: string;
  mastery: number;
  dateAdded: string;
  tags?: string[];
}

// Type aliases for consistency
export type BookItem = Book;
export type JobItem = Job;
export type VocabItem = Vocabulary;

export interface DashboardData {
  books: Book[];
  jobs: Job[];
  vocab: Vocabulary[];
}

export type TabType = 'dash' | 'reading' | 'career' | 'language';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error';
}
