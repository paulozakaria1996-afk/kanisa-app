import React, { useState } from 'react';
import { ADMIN_MASTER_PASSWORD } from '../data/initialData';
import { Member } from '../types/church';
import { Lock, Eye, EyeOff, X, AlertCircle, CheckCircle2, User, Phone } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminLoginSuccess: () => void;
  onMemberLoginSuccess: (member: Member) => void;
  onGoToRegister: () => void;
  members: Member[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAdminLoginSuccess,
  onMemberLoginSuccess,
  onGoToRegister,
  members,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    const val = identifier.trim();

    setTimeout(() => {
      // 1. Check if it matches the Master Admin Password
      if (val === ADMIN_MASTER_PASSWORD) {
        setSuccessMsg('Umetambuliwa kama Msimamizi wa Mfumo!');
        setTimeout(() => {
          onAdminLoginSuccess();
          onClose();
          setIdentifier('');
          setSuccessMsg('');
        }, 500);
        setIsSubmitting(false);
        return;
      }

      // 2. Check if it matches a registered member's phone number or email
      const matchedMember = members.find(
        (m) => m.phone.replace(/\s+/g, '') === val.replace(/\s+/g, '') ||
               (m.email && m.email.toLowerCase() === val.toLowerCase())
      );

      if (matchedMember) {
        setSuccessMsg(`Karibu Ndugu ${matchedMember.fullName}!`);
        setTimeout(() => {
          onMemberLoginSuccess(matchedMember);
          onClose();
          setIdentifier('');
          setSuccessMsg('');
        }, 500);
        setIsSubmitting(false);
        return;
      }

      // Not found
      setError('Taarifa au neno la siri halitambuliki. Ikiwa wewe ni Msimamizi, ingiza neno la siri lililoidhinishwa, au jisajili kama mshirika.');
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Ingia kwenye Mfumo</h3>
            <p className="text-xs text-blue-200 mt-0.5">Weka neno la siri au nambari yako ya simu</p>
          </div>
          <button
            onClick={onClose}
            className="text-blue-200 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Neno la Siri / Nambari ya Simu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Ingiza neno la siri au namba ya simu..."
                className="w-full pl-9 pr-10 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 font-mono"
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
            <p className="mt-1.5 text-[11px] text-slate-500">
              Msimamizi anapotumia neno maalum la uongozi, app itamtambua na kufungua dashibodi moja kwa moja.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !identifier.trim()}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              {isSubmitting ? 'Inathibitisha...' : 'Ingia'}
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-600">
            Hujajisajili bado?{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToRegister();
              }}
              className="text-blue-900 font-semibold hover:underline cursor-pointer"
            >
              Jisajili Hapa
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
