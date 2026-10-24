import React, { useState } from 'react';
import { ADMIN_MASTER_PASSWORD } from '../data/initialData';
import { ShieldCheck, Lock, Eye, EyeOff, X, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      if (password.trim() === ADMIN_MASTER_PASSWORD) {
        onSuccess();
        setPassword('');
        setError('');
        onClose();
      } else {
        setError('Neno maalum la kuingilia si sahihi! Tafadhali hakiki herufi kubwa na ndogo.');
      }
      setIsSubmitting(false);
    }, 300);
  };

  const handleUsePreset = () => {
    setPassword(ADMIN_MASTER_PASSWORD);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header strip */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Uthibitisho wa Msimamizi</h3>
                <p className="text-xs text-blue-200">Ulinzi na Faragha ya Data za Kanisa</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-blue-300 hover:text-white transition-colors p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
            Ili kuhakikisha data zote za washirika zinabaki salama na faragha, mfumo unahitaji neno maalum lililowekwa na uongozi kuingia dashibodi ya msimamizi.
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Neno Maalum la Kuingilia (Master Password)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingiza neno la siri..."
                className="w-full pl-9 pr-10 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent font-mono"
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-blue-900 focus:ring-blue-800"
              />
              <span>Kumbuka katika kifaa hiki</span>
            </label>

            <button
              type="button"
              onClick={handleUsePreset}
              className="text-blue-700 hover:underline font-medium text-xs cursor-pointer"
            >
              Weka Neno Lililoidhinishwa
            </button>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Ghairi
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !password.trim()}
              className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              {isSubmitting ? 'Inathibitisha...' : 'Ingia Mfumo'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
