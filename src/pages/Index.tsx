import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Briefcase, Languages, TrendingUp, Plus, Download, Upload, Moon, Sun, Database, Keyboard, Undo2, Redo2, FileSpreadsheet, Trash2 } from 'lucide-react';
import { DashboardData, TabType, ToastMessage, BookItem, JobItem, VocabItem } from '@/types';
import { StatCard } from '@/components/Dashboard/StatCard';
import { Toast } from '@/components/Dashboard/Toast';
import { Confetti } from '@/components/Dashboard/Confetti';
import { WelcomeModal } from '@/components/Dashboard/WelcomeModal';
import { SearchBar } from '@/components/Dashboard/SearchBar';
import { LockScreen } from '@/components/Dashboard/LockScreen';
import { AIInsights } from '@/components/Dashboard/AIInsights';
import { BooksList } from '@/components/Dashboard/BooksList';
import { BookForm } from '@/components/Dashboard/BookForm';
import { JobsList } from '@/components/Dashboard/JobsList';
import { JobForm } from '@/components/Dashboard/JobForm';
import { VocabList } from '@/components/Dashboard/VocabList';
import { VocabForm } from '@/components/Dashboard/VocabForm';
import { SortControls, SortField, SortOrder } from '@/components/Dashboard/SortControls';
import { EmptyState } from '@/components/Dashboard/EmptyState';
import { ConfirmDialog } from '@/components/Dashboard/ConfirmDialog';
import { LoadingSkeleton } from '@/components/Dashboard/LoadingSkeleton';
import { ProgressStats } from '@/components/Dashboard/ProgressStats';
import { DatabaseSchema } from '@/components/Dashboard/DatabaseSchema';
import { KeyboardShortcuts } from '@/components/Dashboard/KeyboardShortcuts';
import { ProgressChart } from '@/components/Dashboard/ProgressChart';
import { Button } from '@/components/ui/button';

const initialData: DashboardData = {
  books: [
    { 
      id: 1, 
      title: "Atomic Habits", 
      author: "James Clear", 
      pages: 320, 
      status: "completed", 
      rating: 5, 
      dateAdded: "2024-11-15", 
      tags: ["self-help", "productivity"] 
    },
    { 
      id: 2, 
      title: "Deep Work", 
      author: "Cal Newport", 
      pages: 296, 
      status: "reading", 
      rating: 4, 
      dateAdded: "2025-01-10", 
      tags: ["productivity"] 
    }
  ],
  jobs: [
    { 
      id: 1, 
      company: "Google", 
      position: "Software Engineer", 
      status: "interview", 
      dateAdded: "2025-01-05", 
      tags: ["tech"] 
    },
    { 
      id: 2, 
      company: "Meta", 
      position: "Frontend Developer", 
      status: "applied", 
      dateAdded: "2025-01-20", 
      tags: ["tech"] 
    }
  ],
  vocab: [
    { 
      id: 1, 
      word: "Hablar", 
      trans: "To speak", 
      lang: "Spanish", 
      mastery: 90, 
      dateAdded: "2024-12-01", 
      tags: ["verbs"] 
    },
    { 
      id: 2, 
      word: "Comer", 
      trans: "To eat", 
      lang: "Spanish", 
      mastery: 75, 
      dateAdded: "2024-12-15", 
      tags: ["verbs"] 
    }
  ]
};

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>(initialData);
  const [tab, setTab] = useState<TabType>('dash');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(0);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; backgroundColor: string; delay: number }>>([]);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [dataLoading, setDataLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; type: 'book' | 'job' | 'vocab' | null; id: any; title: string }>({
    open: false,
    type: null,
    id: null,
    title: ''
  });
  
  // New features state
  const [history, setHistory] = useState<DashboardData[]>([initialData]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Filtered and sorted data
  const getSortedData = <T extends BookItem | JobItem | VocabItem>(items: T[]): T[] => {
    return [...items].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'date':
          comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
          break;
        case 'title':
          if ('title' in a && 'title' in b) comparison = a.title.localeCompare(b.title);
          break;
        case 'company':
          if ('company' in a && 'company' in b) comparison = a.company.localeCompare(b.company);
          break;
        case 'position':
          if ('position' in a && 'position' in b) comparison = a.position.localeCompare(b.position);
          break;
        case 'word':
          if ('word' in a && 'word' in b) comparison = a.word.localeCompare(b.word);
          break;
        case 'status':
          if ('status' in a && 'status' in b) comparison = a.status.localeCompare(b.status);
          break;
        case 'rating':
          if ('rating' in a && 'rating' in b) {
            const ratingA = a.rating || 0;
            const ratingB = b.rating || 0;
            comparison = ratingA - ratingB;
          }
          break;
        case 'mastery':
          if ('mastery' in a && 'mastery' in b) comparison = a.mastery - b.mastery;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };
  
  const filteredBooks = getSortedData(data.books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ));
  
  const filteredJobs = getSortedData(data.jobs.filter(job =>
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ));
  
  const filteredVocab = getSortedData(data.vocab.filter(vocab =>
    vocab.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vocab.trans.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vocab.lang.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vocab.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ));
  
  // Form states
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState<BookItem | undefined>();
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobItem | undefined>();
  const [showVocabForm, setShowVocabForm] = useState(false);
  const [editingVocab, setEditingVocab] = useState<VocabItem | undefined>();

  // Auth check removed - demo mode
  useEffect(() => {
    setLoading(false);
  }, []);

  // Demo mode - use local data only

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;
      
      if (modifier && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      } else if (modifier && e.key === 'n') {
        e.preventDefault();
        handleFABClick();
      } else if (modifier && e.key === 'e' && !e.shiftKey) {
        e.preventDefault();
        exportToJSON();
      } else if (modifier && e.key === 'e' && e.shiftKey) {
        e.preventDefault();
        exportToCSV();
      } else if (modifier && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (modifier && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      } else if (modifier && e.key === 'd') {
        e.preventDefault();
        setDarkMode(!darkMode);
      } else if (modifier && e.key === '/') {
        e.preventDefault();
        setShowKeyboardShortcuts(true);
      } else if (e.key >= '1' && e.key <= '5') {
        const tabs: TabType[] = ['dash', 'reading', 'career', 'language', 'schema'];
        setTab(tabs[parseInt(e.key) - 1]);
      } else if (e.key === 'Escape') {
        setShowBookForm(false);
        setShowJobForm(false);
        setShowVocabForm(false);
        setShowKeyboardShortcuts(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [darkMode, tab]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (unsavedChanges >= 5 && unsavedChanges % 5 === 0) {
      setToast({ message: `💾 ${unsavedChanges} unsaved changes! Consider exporting your data.`, type: 'error' });
    }
  }, [unsavedChanges]);

  const triggerConfetti = () => {
    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];
    const pieces = Array.from({ length: 50 }, () => ({
      id: Math.random(),
      left: Math.random() * 100,
      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 3000);
  };

  // Undo/Redo functionality
  const saveToHistory = useCallback((newData: DashboardData) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newData);
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setData(newData);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setData(history[historyIndex - 1]);
      setToast({ message: '↩️ Undo', type: 'success' });
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setData(history[historyIndex + 1]);
      setToast({ message: '↪️ Redo', type: 'success' });
    }
  }, [history, historyIndex]);

  const handleFABClick = () => {
    if (tab === 'reading') {
      setEditingBook(undefined);
      setShowBookForm(true);
    } else if (tab === 'career') {
      setEditingJob(undefined);
      setShowJobForm(true);
    } else if (tab === 'language') {
      setEditingVocab(undefined);
      setShowVocabForm(true);
    }
  };

  const handleStatClick = (type: 'books' | 'jobs' | 'words') => {
    if (type === 'books') {
      setTab('reading');
    } else if (type === 'jobs') {
      setTab('career');
    } else if (type === 'words') {
      setTab('language');
    }
    setToast({ message: '🔍 Filtered view applied!', type: 'success' });
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `growth-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setToast({ message: '💾 Data exported successfully!', type: 'success' });
    setUnsavedChanges(0);
  };

  const exportToCSV = () => {
    const books = data.books.map(b => 
      `Book,${b.title},${b.author},${b.status},${b.rating || ''},${b.dateAdded}`
    ).join('\n');
    const jobs = data.jobs.map(j => 
      `Job,${j.company},${j.position},${j.status},${j.dateAdded}`
    ).join('\n');
    const vocab = data.vocab.map(v => 
      `Vocab,${v.word},${v.trans},${v.lang},${v.mastery},${v.dateAdded}`
    ).join('\n');
    const csv = `Type,Title/Word,Author/Translation,Status/Language,Rating/Mastery,Date\n${books}\n${jobs}\n${vocab}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `growth-dashboard-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setToast({ message: '📊 CSV exported successfully!', type: 'success' });
  };

  const handleJSONUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        if (!importedData.books || !importedData.jobs || !importedData.vocab) {
          setToast({ message: '❌ Invalid JSON format!', type: 'error' });
          return;
        }
        setData(importedData);
        triggerConfetti();
        setToast({ message: '🎉 Data imported successfully!', type: 'success' });
        setUnsavedChanges(0);
      } catch (error) {
        setToast({ message: '❌ Error parsing JSON file!', type: 'error' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSaveBook = (book: Omit<BookItem, 'id'> & { id?: any }) => {
    if (book.id) {
      const updatedData = {
        ...data,
        books: data.books.map(b => b.id === book.id ? book as BookItem : b)
      };
      saveToHistory(updatedData);
      setToast({ message: '📚 Book updated!', type: 'success' });
    } else {
      const newBook: BookItem = { ...book, id: Date.now(), dateAdded: new Date().toISOString().split('T')[0] };
      const updatedData = { ...data, books: [...data.books, newBook] };
      saveToHistory(updatedData);
      setToast({ message: '📚 Book added!', type: 'success' });
      if (book.status === 'completed') triggerConfetti();
    }
    setShowBookForm(false);
    setEditingBook(undefined);
  };

  const handleEditBook = (book: BookItem) => {
    setEditingBook(book);
    setShowBookForm(true);
  };

  const handleDeleteBook = (id: any) => {
    const book = data.books.find(b => b.id === id);
    setDeleteConfirm({
      open: true,
      type: 'book',
      id,
      title: book?.title || 'this book'
    });
  };

  const confirmDelete = () => {
    const { type, id } = deleteConfirm;
    if (type === 'book') {
      const updatedData = { ...data, books: data.books.filter(b => b.id !== id) };
      saveToHistory(updatedData);
      setToast({ message: '🗑️ Book deleted!', type: 'success' });
    } else if (type === 'job') {
      const updatedData = { ...data, jobs: data.jobs.filter(j => j.id !== id) };
      saveToHistory(updatedData);
      setToast({ message: '🗑️ Job deleted!', type: 'success' });
    } else if (type === 'vocab') {
      const updatedData = { ...data, vocab: data.vocab.filter(v => v.id !== id) };
      saveToHistory(updatedData);
      setToast({ message: '🗑️ Vocabulary deleted!', type: 'success' });
    }
    setDeleteConfirm({ open: false, type: null, id: null, title: '' });
  };

  // Batch delete functionality
  const handleBatchDelete = () => {
    if (selectedItems.length === 0) return;
    if (!confirm(`Delete ${selectedItems.length} selected items?`)) return;
    
    const bookIds = selectedItems.filter(id => id.startsWith('book-')).map(id => id.replace('book-', ''));
    const jobIds = selectedItems.filter(id => id.startsWith('job-')).map(id => id.replace('job-', ''));
    const vocabIds = selectedItems.filter(id => id.startsWith('vocab-')).map(id => id.replace('vocab-', ''));
    
    const updatedData = {
      books: data.books.filter(b => !bookIds.includes(b.id.toString())),
      jobs: data.jobs.filter(j => !jobIds.includes(j.id.toString())),
      vocab: data.vocab.filter(v => !vocabIds.includes(v.id.toString()))
    };
    
    saveToHistory(updatedData);
    setSelectedItems([]);
    setToast({ message: `🗑️ Deleted ${selectedItems.length} items!`, type: 'success' });
  };

  // CRUD handlers for Jobs
  const handleSaveJob = (job: Omit<JobItem, 'id'> & { id?: any }) => {
    if (job.id) {
      const updatedData = {
        ...data,
        jobs: data.jobs.map(j => j.id === job.id ? job as JobItem : j)
      };
      saveToHistory(updatedData);
      setToast({ message: '💼 Job updated!', type: 'success' });
    } else {
      const newJob: JobItem = { ...job, id: Date.now(), dateAdded: new Date().toISOString().split('T')[0] };
      const updatedData = { ...data, jobs: [...data.jobs, newJob] };
      saveToHistory(updatedData);
      setToast({ message: '💼 Job added!', type: 'success' });
    }
    setShowJobForm(false);
    setEditingJob(undefined);
  };

  const handleEditJob = (job: JobItem) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleDeleteJob = (id: any) => {
    const job = data.jobs.find(j => j.id === id);
    setDeleteConfirm({
      open: true,
      type: 'job',
      id,
      title: `${job?.company} - ${job?.position}` || 'this job'
    });
  };

  // CRUD handlers for Vocabulary
  const handleSaveVocab = (vocab: Omit<VocabItem, 'id'> & { id?: any }) => {
    if (vocab.id) {
      const updatedData = {
        ...data,
        vocab: data.vocab.map(v => v.id === vocab.id ? vocab as VocabItem : v)
      };
      saveToHistory(updatedData);
      setToast({ message: '📖 Vocabulary updated!', type: 'success' });
    } else {
      const newVocab: VocabItem = { ...vocab, id: Date.now(), dateAdded: new Date().toISOString().split('T')[0] };
      const updatedData = { ...data, vocab: [...data.vocab, newVocab] };
      saveToHistory(updatedData);
      setToast({ message: '📖 Vocabulary added!', type: 'success' });
      if (vocab.mastery >= 90) triggerConfetti();
    }
    setShowVocabForm(false);
    setEditingVocab(undefined);
  };

  const handleEditVocab = (vocab: VocabItem) => {
    setEditingVocab(vocab);
    setShowVocabForm(true);
  };

  const handleDeleteVocab = (id: any) => {
    const vocab = data.vocab.find(v => v.id === id);
    setDeleteConfirm({
      open: true,
      type: 'vocab',
      id,
      title: vocab?.word || 'this vocabulary'
    });
  };


  const stats = {
    books: data.books.filter(b => b.status === 'completed').length,
    jobs: data.jobs.filter(j => j.status !== 'rejected').length,
    words: data.vocab.length,
    mastery: data.vocab.length > 0 
      ? Math.round(data.vocab.reduce((s, v) => s + v.mastery, 0) / data.vocab.length) 
      : 0
  };

  const tabs = [
    { id: 'dash' as TabType, label: 'Dashboard', icon: TrendingUp },
    { id: 'reading' as TabType, label: 'Reading', icon: BookOpen },
    { id: 'career' as TabType, label: 'Career', icon: Briefcase },
    { id: 'language' as TabType, label: 'Language', icon: Languages },
    { id: 'schema' as TabType, label: 'Schema', icon: Database }
  ];

  const handleSortChange = (field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return <LockScreen onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <Confetti pieces={confetti} />
      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}
        title="Confirm Delete"
        description={`Are you sure you want to delete "${deleteConfirm.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
      />

      {showWelcomeModal && (
        <WelcomeModal 
          onClose={() => setShowWelcomeModal(false)} 
          onImport={handleJSONUpload}
        />
      )}

      {showKeyboardShortcuts && (
        <KeyboardShortcuts onClose={() => setShowKeyboardShortcuts(false)} />
      )}

      {/* Header */}
      <div className="bg-card shadow-lg border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                Personal Growth Dashboard 
                <span className="animate-pulse-soft">✨</span>
              </h1>
              <p className="text-muted-foreground">Track reading, career & language learning</p>
            </div>
            
            <div className="flex gap-2 items-center flex-wrap">
              {/* Undo/Redo */}
              <Button
                onClick={undo}
                disabled={historyIndex === 0}
                variant="outline"
                size="icon"
                className="rounded-xl hover:scale-105 transition-transform"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={redo}
                disabled={historyIndex === history.length - 1}
                variant="outline"
                size="icon"
                className="rounded-xl hover:scale-105 transition-transform"
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo2 className="h-4 w-4" />
              </Button>

              {/* Batch Delete */}
              {selectedItems.length > 0 && (
                <Button
                  onClick={handleBatchDelete}
                  variant="destructive"
                  className="hover:scale-105 transition-transform"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedItems.length})
                </Button>
              )}
              
              {/* Export Dropdown */}
              <div className="relative group">
                <Button
                  className="gradient-green text-white hover:scale-105 transition-transform"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                  {unsavedChanges > 0 && (
                    <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse-soft">
                      {unsavedChanges}
                    </span>
                  )}
                </Button>
                <div className="absolute top-full right-0 mt-2 w-40 bg-card rounded-xl shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <button onClick={exportToJSON} className="w-full px-4 py-2 text-left hover:bg-accent rounded-t-xl text-sm flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    JSON
                  </button>
                  <button onClick={exportToCSV} className="w-full px-4 py-2 text-left hover:bg-accent rounded-b-xl text-sm flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    CSV
                  </button>
                </div>
              </div>
              
              <label htmlFor="json-upload">
                <Button
                  asChild
                  className="gradient-blue text-white hover:scale-105 transition-transform cursor-pointer"
                >
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </span>
                </Button>
              </label>
              <input 
                id="json-upload" 
                type="file" 
                accept=".json" 
                onChange={handleJSONUpload} 
                className="hidden" 
              />
              
              <Button
                onClick={() => setDarkMode(!darkMode)}
                variant="outline"
                size="icon"
                className="rounded-xl hover:scale-105 transition-transform"
                title="Toggle Dark Mode (Ctrl+D)"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <Button
                onClick={() => setShowKeyboardShortcuts(true)}
                variant="outline"
                size="icon"
                className="rounded-xl hover:scale-105 transition-transform"
                title="Keyboard Shortcuts (Ctrl+/)"
              >
                <Keyboard className="h-5 w-5" />
              </Button>
              
            </div>
          </div>
          
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto pt-6">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                  tab === t.id
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Dashboard Tab */}
        {tab === 'dash' && (
          <div className="space-y-6 pb-12 animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold text-foreground">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Books completed"
                value={stats.books}
                icon={BookOpen}
                gradient="gradient-blue"
                onClick={() => handleStatClick('books')}
                animationDelay="0s"
              />
              <StatCard
                title="Active jobs"
                value={stats.jobs}
                icon={Briefcase}
                gradient="gradient-green"
                onClick={() => handleStatClick('jobs')}
                animationDelay="0.2s"
              />
              <StatCard
                title="Words learned"
                value={stats.words}
                icon={Languages}
                gradient="gradient-purple"
                onClick={() => handleStatClick('words')}
                animationDelay="0.4s"
              />
              <StatCard
                title="Avg mastery"
                value={`${stats.mastery}%`}
                icon={TrendingUp}
                gradient="gradient-orange"
                animationDelay="0.6s"
              />
            </div>

            {/* Progress Stats */}
            <ProgressStats data={data} />

            {/* Progress Chart */}
            <ProgressChart data={data} />

            {/* AI Insights Section */}
            <AIInsights data={data} currentTab={tab} />

            <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
              <h3 className="text-2xl font-bold text-foreground mb-4">Getting Started</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <BookOpen className="h-8 w-8 text-primary mb-2" />
                  <h4 className="font-semibold text-foreground mb-1">Track Books</h4>
                  <p className="text-sm text-muted-foreground">Log your reading journey and rate books</p>
                </div>
                <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                  <Briefcase className="h-8 w-8 text-success mb-2" />
                  <h4 className="font-semibold text-foreground mb-1">Manage Applications</h4>
                  <p className="text-sm text-muted-foreground">Keep track of job applications</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <Languages className="h-8 w-8 text-purple-500 mb-2" />
                  <h4 className="font-semibold text-foreground mb-1">Learn Languages</h4>
                  <p className="text-sm text-muted-foreground">Build your vocabulary with mastery tracking</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reading Tab */}
        {tab === 'reading' && (
          <div className="space-y-6 pb-12 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-3xl font-bold text-foreground">Reading Tracker</h2>
              <Button 
                className="gradient-blue text-white w-full sm:w-auto"
                onClick={() => {
                  setEditingBook(undefined);
                  setShowBookForm(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Book
              </Button>
            </div>
            
            <AIInsights data={data} currentTab={tab} />
            
            {showBookForm ? (
              <BookForm
                book={editingBook}
                onSave={handleSaveBook}
                onCancel={() => {
                  setShowBookForm(false);
                  setEditingBook(undefined);
                }}
              />
            ) : (
              <>
                {dataLoading ? (
                  <LoadingSkeleton count={3} />
                ) : filteredBooks.length === 0 ? (
                  <EmptyState
                    icon={BookOpen}
                    title="No books yet"
                    description="Start tracking your reading journey by adding your first book!"
                    actionLabel="Add Book"
                    onAction={() => {
                      setEditingBook(undefined);
                      setShowBookForm(true);
                    }}
                  />
                ) : (
                  <>
                    <SortControls
                      fields={[
                        { value: 'date', label: 'Date' },
                        { value: 'title', label: 'Title' },
                        { value: 'status', label: 'Status' },
                        { value: 'rating', label: 'Rating' }
                      ]}
                      currentField={sortField}
                      currentOrder={sortOrder}
                      onSortChange={handleSortChange}
                    />
                    <BooksList
                      books={filteredBooks}
                      onEdit={handleEditBook}
                      onDelete={handleDeleteBook}
                      selectedItems={selectedItems}
                      onSelectItem={(id, selected) => {
                        if (selected) {
                          setSelectedItems([...selectedItems, id]);
                        } else {
                          setSelectedItems(selectedItems.filter(item => item !== id));
                        }
                      }}
                    />
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* Career Tab */}
        {tab === 'career' && (
          <div className="space-y-6 pb-12 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-3xl font-bold text-foreground">Career Tracker</h2>
              <Button 
                className="gradient-green text-white w-full sm:w-auto"
                onClick={() => {
                  setEditingJob(undefined);
                  setShowJobForm(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Job
              </Button>
            </div>
            
            <AIInsights data={data} currentTab={tab} />
            
            {showJobForm ? (
              <JobForm
                job={editingJob}
                onSave={handleSaveJob}
                onCancel={() => {
                  setShowJobForm(false);
                  setEditingJob(undefined);
                }}
              />
            ) : (
              <>
                {dataLoading ? (
                  <LoadingSkeleton count={3} />
                ) : filteredJobs.length === 0 ? (
                  <EmptyState
                    icon={Briefcase}
                    title="No job applications yet"
                    description="Start tracking your career journey by adding your first job application!"
                    actionLabel="Add Job"
                    onAction={() => {
                      setEditingJob(undefined);
                      setShowJobForm(true);
                    }}
                  />
                ) : (
                  <>
                    <SortControls
                      fields={[
                        { value: 'date', label: 'Date' },
                        { value: 'company', label: 'Company' },
                        { value: 'position', label: 'Position' },
                        { value: 'status', label: 'Status' }
                      ]}
                      currentField={sortField}
                      currentOrder={sortOrder}
                      onSortChange={handleSortChange}
                    />
                    <JobsList
                      jobs={filteredJobs}
                      onEdit={handleEditJob}
                      onDelete={handleDeleteJob}
                      selectedItems={selectedItems}
                      onSelectItem={(id, selected) => {
                        if (selected) {
                          setSelectedItems([...selectedItems, id]);
                        } else {
                          setSelectedItems(selectedItems.filter(item => item !== id));
                        }
                      }}
                    />
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* Language Tab */}
        {tab === 'language' && (
          <div className="space-y-6 pb-12 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-3xl font-bold text-foreground">Language Learning</h2>
              <Button 
                className="gradient-purple text-white w-full sm:w-auto"
                onClick={() => {
                  setEditingVocab(undefined);
                  setShowVocabForm(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Vocabulary
              </Button>
            </div>
            
            <AIInsights data={data} currentTab={tab} />
            
            {showVocabForm ? (
              <VocabForm
                vocab={editingVocab}
                onSave={handleSaveVocab}
                onCancel={() => {
                  setShowVocabForm(false);
                  setEditingVocab(undefined);
                }}
              />
            ) : (
              <>
                {dataLoading ? (
                  <LoadingSkeleton count={3} />
                ) : filteredVocab.length === 0 ? (
                  <EmptyState
                    icon={Languages}
                    title="No vocabulary yet"
                    description="Start building your vocabulary by adding your first word!"
                    actionLabel="Add Vocabulary"
                    onAction={() => {
                      setEditingVocab(undefined);
                      setShowVocabForm(true);
                    }}
                  />
                ) : (
                  <>
                    <SortControls
                      fields={[
                        { value: 'date', label: 'Date' },
                        { value: 'word', label: 'Word' },
                        { value: 'mastery', label: 'Mastery' }
                      ]}
                      currentField={sortField}
                      currentOrder={sortOrder}
                      onSortChange={handleSortChange}
                    />
                    <VocabList
                      vocab={filteredVocab}
                      onEdit={handleEditVocab}
                      onDelete={handleDeleteVocab}
                      selectedItems={selectedItems}
                      onSelectItem={(id, selected) => {
                        if (selected) {
                          setSelectedItems([...selectedItems, id]);
                        } else {
                          setSelectedItems(selectedItems.filter(item => item !== id));
                        }
                      }}
                    />
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* Schema Tab */}
        {tab === 'schema' && (
          <div className="space-y-6 pb-12 animate-in fade-in duration-500">
            <DatabaseSchema />
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 gradient-blue text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40">
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Index;
