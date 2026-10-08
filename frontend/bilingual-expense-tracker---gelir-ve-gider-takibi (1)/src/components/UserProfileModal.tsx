import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { X, User, Mail, Shield, Calendar, Key, Copy, Check, LogOut } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { t, language, formatDate } = useLanguage();
  const { user, token, logout } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !user) return null;

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111726] border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/40">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">{t('profile')}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Avatar and name banner */}
          <div className="flex items-center gap-4 p-4 bg-slate-900/80 rounded-xl border border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg shadow-emerald-500/20">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h4 className="text-base font-bold text-white leading-tight">{user.fullName || user.username}</h4>
              <p className="text-xs text-slate-400 font-mono">@{user.username}</p>
            </div>
          </div>

          {/* Details list */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {t('email')}
              </span>
              <span className="font-semibold text-slate-200">{user.email}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                {t('role')}
              </span>
              <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {user.role}
              </span>
            </div>

            {user.birthdate && (
              <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {t('birthdate')}
                </span>
                <span className="font-medium text-slate-200">{formatDate(user.birthdate)}</span>
              </div>
            )}
          </div>

          {/* JWT Token box */}
          {token && (
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-emerald-400" />
                  {t('tokenInfo')}
                </span>
                <button
                  onClick={handleCopyToken}
                  className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? t('tokenCopied') : t('copyToken')}</span>
                </button>
              </div>
              <p className="text-[10px] font-mono text-slate-500 break-all line-clamp-2">
                {token}
              </p>
            </div>
          )}

          {/* Logout Action */}
          <div className="pt-2">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('signOut')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
