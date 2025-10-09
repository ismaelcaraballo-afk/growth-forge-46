import { CheckCircle, AlertCircle } from 'lucide-react';
import { ToastMessage } from '@/types';

export const Toast = ({ message, type }: ToastMessage) => (
  <div
    className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-in slide-in-from-right duration-300 ${
      type === 'success' 
        ? 'bg-success text-success-foreground' 
        : 'bg-destructive text-destructive-foreground'
    }`}
  >
    {type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
    <span className="font-medium">{message}</span>
  </div>
);
