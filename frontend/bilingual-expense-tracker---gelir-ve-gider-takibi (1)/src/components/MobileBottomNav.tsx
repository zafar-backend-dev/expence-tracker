import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  Receipt,
  Tags,
  BarChart3,
  Plus,
} from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: 'dashboard' | 'transactions' | 'categories' | 'analytics';
  setCurrentTab: (tab: 'dashboard' | 'transactions' | 'categories' | 'analytics') => void;
  onOpenAddTransaction: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAddTransaction,
}) => {
  const { t } = useLanguage();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0d131f]/95 backdrop-blur-xl border-t border-slate-800/80 px-2 pb-safe">
      <div className="flex items-center justify-around h-16 relative">
        {/* Dashboard */}
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[48px] transition-colors ${
            currentTab === 'dashboard' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{t('dashboard')}</span>
        </button>

        {/* Transactions */}
        <button
          onClick={() => setCurrentTab('transactions')}
          className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[48px] transition-colors ${
            currentTab === 'transactions' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Receipt className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{t('transactions')}</span>
        </button>

        {/* Center Floating Plus Button */}
        <div className="flex-1 flex items-center justify-center -mt-6">
          <button
            onClick={onOpenAddTransaction}
            className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-transform"
            title={t('addTransaction')}
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Categories */}
        <button
          onClick={() => setCurrentTab('categories')}
          className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[48px] transition-colors ${
            currentTab === 'categories' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tags className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{t('categories')}</span>
        </button>

        {/* Analytics */}
        <button
          onClick={() => setCurrentTab('analytics')}
          className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[48px] transition-colors ${
            currentTab === 'analytics' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{t('analytics')}</span>
        </button>
      </div>
    </nav>
  );
};
