export interface Book {
  id: number;
  title: string;
  author: string;
  pages: number;
  status: 'reading' | 'completed' | 'wishlist';
  rating?: number;
  dateAdded: string;
  tags?: string[];
}

export interface Job {
  id: number;
  company: string;
  position: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected';
  dateAdded: string;
  tags?: string[];
}

export interface Vocabulary {
  id: number;
  word: string;
  trans: string;
  lang: string;
  mastery: number;
  dateAdded: string;
  tags?: string[];
}

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
