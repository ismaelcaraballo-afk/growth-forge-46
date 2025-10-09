import { Lock } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface LockScreenProps {
  onUnlock: () => void;
}

export const LockScreen = ({ onUnlock }: LockScreenProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleUnlock = () => {
    if (password === '123') {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-card shadow-2xl rounded-3xl p-8 max-w-md w-full text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-blue flex items-center justify-center">
          <Lock className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-2 text-foreground">Private Mode</h2>
        <p className="text-muted-foreground mb-6">Enter password to unlock</p>
        <p className="text-sm text-muted-foreground mb-4">(Hint: 123)</p>
        
        <input
          type="password"
          placeholder="Password"
          className={`w-full px-4 py-3 border rounded-xl mb-4 bg-background text-foreground transition-all ${
            error ? 'border-destructive ring-2 ring-destructive/20' : 'border-border'
          }`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
        />
        
        <Button
          onClick={handleUnlock}
          className="w-full gradient-blue text-white py-6 text-lg font-semibold hover:scale-105 transition-transform"
        >
          Unlock Dashboard
        </Button>
      </div>
    </div>
  );
};
