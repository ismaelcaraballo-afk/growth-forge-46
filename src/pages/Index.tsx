import { useState, useEffect } from 'react';
import { BookOpen, Briefcase, Languages, TrendingUp, Plus, Download, Upload, Moon, Sun } from 'lucide-react';
import { DashboardData, TabType, ToastMessage } from '@/types';
import { StatCard } from '@/components/Dashboard/StatCard';
import { Toast } from '@/components/Dashboard/Toast';
import { Confetti } from '@/components/Dashboard/Confetti';
import { WelcomeModal } from '@/components/Dashboard/WelcomeModal';
import { SearchBar } from '@/components/Dashboard/SearchBar';
import { LockScreen } from '@/components/Dashboard/LockScreen';
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
  const [data, setData] = useState<DashboardData>(initialData);
  const [tab, setTab] = useState<TabType>('dash');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(0);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; backgroundColor: string; delay: number }>>([]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
    { id: 'language' as TabType, label: 'Language', icon: Languages }
  ];

  if (!isUnlocked) {
    return <LockScreen onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <Confetti pieces={confetti} />

      {showWelcomeModal && (
        <WelcomeModal 
          onClose={() => setShowWelcomeModal(false)} 
          onImport={handleJSONUpload}
        />
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
            
            <div className="flex gap-2 items-center">
              <Button
                onClick={exportToJSON}
                className="gradient-green text-white hover:scale-105 transition-transform relative"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
                {unsavedChanges > 0 && (
                  <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse-soft">
                    {unsavedChanges}
                  </span>
                )}
              </Button>
              
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
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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

        {/* Other tabs will be implemented */}
        {tab !== 'dash' && (
          <div className="pb-12 animate-in fade-in duration-500">
            <div className="bg-card rounded-2xl p-12 text-center shadow-lg">
              <p className="text-2xl font-bold text-foreground mb-2">Coming Soon!</p>
              <p className="text-muted-foreground">This section is being refactored with improved components.</p>
            </div>
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
