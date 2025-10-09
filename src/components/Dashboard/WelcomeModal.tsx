import { Sparkles, Upload, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeModalProps {
  onClose: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const WelcomeModal = ({ onClose, onImport }: WelcomeModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-card rounded-3xl max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 text-center">
          <Sparkles className="h-16 w-16 mx-auto text-primary animate-pulse-soft mb-4" />
          <h2 className="text-3xl font-bold mb-4 text-foreground">Welcome! 🎉</h2>
          <p className="text-muted-foreground mb-6">
            Track your reading, career progress, and language learning all in one place.
          </p>
          
          <div className="p-4 rounded-xl bg-warning/10 border-2 border-warning/30 mb-6 text-left">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-foreground mb-1">⚠️ Data not saved automatically!</p>
                <p className="text-sm text-muted-foreground">
                  Your data will be lost when you refresh. Remember to Export regularly!
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="cursor-pointer">
              <div className="gradient-blue px-6 py-3 rounded-xl flex items-center justify-center gap-2 text-white font-medium hover:scale-105 transition-transform">
                <Upload className="h-5 w-5" />
                Import Previous Backup
              </div>
              <input 
                type="file" 
                accept=".json" 
                onChange={(e) => { 
                  onImport(e); 
                  onClose(); 
                }} 
                className="hidden" 
              />
            </label>
            
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full py-6"
            >
              Start Fresh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
