import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Wallet,
  Coins,
  Server,
  User,
  LogOut,
  LayoutDashboard,
  Receipt,
  Tags,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'dashboard' | 'transactions' | 'categories' | 'analytics';
  setCurrentTab: (tab: 'dashboard' | 'transactions' | 'categories' | 'analytics') => void;
  onOpenProfile: () => void;
  onOpenApiConfig: () => void;
  onOpenAddTransaction: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenProfile,
  onOpenApiConfig,
  onOpenAddTransaction,
}) => {
  const { language, setLanguage, t, currency, setCurrency } = useLanguage();
  const { user, logout, connectionStatus } = useAuth();
  const [currencyDropdown, setCurrencyDropdown] = useState(false);

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'transactions', label: t('transactions'), icon: Receipt },
    { id: 'categories', label: t('categories'), icon: Tags },
    { id: 'analytics', label: t('analytics'), icon: BarChart3 },
  ] as const;

  return (
    <header className="sticky top-0 z-30 bg-[#0a0f19]/90 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="flex items-center gap-2.5 sm:gap-3 group text-left focus:outline-none"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#0b0f17] rounded-[10px] flex items-center justify-center">
                  <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                  {t('appName')}
                </span>
                <span className="hidden sm:block text-[11px] text-slate-400 font-medium leading-none">
                  {t('appSubtitle')}
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/60'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Language, Currency, API Status, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs font-semibold">
              <button
                onClick={() => setLanguage('tr')}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg transition-colors min-h-[36px] ${
                  language === 'tr'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Türkçe"
              >
                <span>🇹🇷</span>
                <span className="text-[11px] font-bold">TR</span>
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg transition-colors min-h-[36px] ${
                  language === 'en'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="English"
              >
                <span>🇬🇧</span>
                <span className="text-[11px] font-bold">EN</span>
              </button>
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdown(!currencyDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold text-slate-300 transition-colors min-h-[36px]"
                title={t('currency')}
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {currencyDropdown && (
                <div
                  className="absolute right-0 mt-1 w-28 bg-[#121927] border border-slate-700 rounded-xl shadow-2xl py-1 z-50 text-xs"
                  onClick={() => setCurrencyDropdown(false)}
                >
                  <button
                    onClick={() => setCurrency('TRY')}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-800 transition-colors ${
                      currency === 'TRY' ? 'text-emerald-400 font-bold' : 'text-slate-300'
                    }`}
                  >
                    ₺ TRY
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-800 transition-colors ${
                      currency === 'USD' ? 'text-emerald-400 font-bold' : 'text-slate-300'
                    }`}
                  >
                    $ USD
                  </button>
                  <button
                    onClick={() => setCurrency('EUR')}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-800 transition-colors ${
                      currency === 'EUR' ? 'text-emerald-400 font-bold' : 'text-slate-300'
                    }`}
                  >
                    € EUR
                  </button>
                </div>
              )}
            </div>

            {/* API Connection Indicator */}
            <button
              onClick={onOpenApiConfig}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all min-h-[36px] ${
                connectionStatus === 'connected'
                  ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300 hover:bg-emerald-900/40'
                  : connectionStatus === 'connecting'
                  ? 'bg-amber-950/30 border-amber-800/50 text-amber-300 hover:bg-amber-900/40'
                  : 'bg-rose-950/30 border-rose-800/50 text-rose-300 hover:bg-rose-900/40'
              }`}
              title={t('apiConfigTitle')}
            >
              {connectionStatus === 'connected' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : connectionStatus === 'connecting' ? (
                <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              )}
              <span className="hidden xl:inline">
                {connectionStatus === 'connected'
                  ? t('connected')
                  : connectionStatus === 'connecting'
                  ? t('connecting')
                  : t('disconnected')}
              </span>
            </button>

            {/* Desktop Add Transaction Button */}
            <button
              onClick={onOpenAddTransaction}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[36px]"
            >
              <span>+</span>
              <span>{t('addTransaction')}</span>
            </button>

            {/* Profile & Logout */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-medium text-slate-200 transition-colors min-h-[36px]"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                  {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </div>
                <span className="max-w-[70px] sm:max-w-[110px] truncate hidden xs:inline">
                  {user?.fullName || user?.username}
                </span>
              </button>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                title={t('signOut')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
