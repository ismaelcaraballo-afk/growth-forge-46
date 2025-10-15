import { Keyboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KeyboardShortcutsProps {
  onClose: () => void;
}

export const KeyboardShortcuts = ({ onClose }: KeyboardShortcutsProps) => {
  const shortcuts = [
    { keys: 'Ctrl/Cmd + K', action: 'Focus Search' },
    { keys: 'Ctrl/Cmd + N', action: 'Add New Item (current tab)' },
    { keys: 'Ctrl/Cmd + E', action: 'Export Data (JSON)' },
    { keys: 'Ctrl/Cmd + Shift + E', action: 'Export Data (CSV)' },
    { keys: 'Ctrl/Cmd + Z', action: 'Undo' },
    { keys: 'Ctrl/Cmd + Shift + Z', action: 'Redo' },
    { keys: 'Ctrl/Cmd + D', action: 'Toggle Dark Mode' },
    { keys: 'Ctrl/Cmd + /', action: 'Show Shortcuts' },
    { keys: 'Esc', action: 'Close Modal' },
    { keys: '1-5', action: 'Switch Tabs' }
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-card rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200 border border-border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Keyboard className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-bold text-foreground">Keyboard Shortcuts</h3>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="hover:bg-accent"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="space-y-3">
          {shortcuts.map((shortcut, idx) => (
            <div 
              key={idx} 
              className="flex justify-between items-center p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
            >
              <span className="font-mono text-sm text-foreground font-medium">
                {shortcut.keys}
              </span>
              <span className="text-sm text-muted-foreground">
                {shortcut.action}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
