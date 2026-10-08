import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TransactionResponseDto, CategoryResponseDto } from '../types/api';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ChevronRight,
  Sparkles,
  PieChart,
} from 'lucide-react';

interface DashboardViewProps {
  transactions: TransactionResponseDto[];
  categories: CategoryResponseDto[];
  onOpenAddModal: () => void;
  onNavigateToTransactions: () => void;
  onNavigateToCategories: () => void;
  onEditTransaction: (tx: TransactionResponseDto) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  transactions,
  categories,
  onOpenAddModal,
  onNavigateToTransactions,
  onNavigateToCategories,
  onEditTransaction,
}) => {
  const { t, formatCurrency, formatDate, getCategoryName } = useLanguage();

  // Financial calculations
  const totalIncome = transactions
    .filter((tx) => tx.type === 'INCOME')
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const totalExpense = transactions
    .filter((tx) => tx.type === 'EXPENSE')
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const totalBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

  // Category breakdown for expenses
  const categoryMap = new Map<string, CategoryResponseDto>();
  categories.forEach((cat) => categoryMap.set(cat.pkey, cat));

  const expensesByCategory: Record<string, { total: number; count: number; cat?: CategoryResponseDto }> = {};
  transactions
    .filter((tx) => tx.type === 'EXPENSE')
    .forEach((tx) => {
      const cat = categoryMap.get(tx.categoryId);
      if (!expensesByCategory[tx.categoryId]) {
        expensesByCategory[tx.categoryId] = { total: 0, count: 0, cat };
      }
      expensesByCategory[tx.categoryId].total += Number(tx.amount || 0);
      expensesByCategory[tx.categoryId].count += 1;
    });

  const sortedExpenseCategories = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b.total - a.total)
    .slice(0, 5);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t('dashboard')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('appSubtitle')}
          </p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addTransaction')}</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Balance */}
        <div className="p-5 bg-gradient-to-br from-slate-900 to-[#121927] border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t('totalBalance')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-2xl font-extrabold ${totalBalance >= 0 ? 'text-white' : 'text-rose-400'}`}>
              {formatCurrency(totalBalance)}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {totalBalance >= 0 ? 'Pozitif Nakit Akışı / Positive Flow' : 'Negatif Bakiye / Deficit'}
            </span>
          </div>
        </div>

        {/* Total Income */}
        <div className="p-5 bg-gradient-to-br from-slate-900 to-[#121927] border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t('totalIncome')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-emerald-400">
              +{formatCurrency(totalIncome)}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {transactions.filter((t) => t.type === 'INCOME').length} {t('income').toLowerCase()}
            </span>
          </div>
        </div>

        {/* Total Expense */}
        <div className="p-5 bg-gradient-to-br from-slate-900 to-[#121927] border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t('totalExpense')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-rose-400">
              -{formatCurrency(totalExpense)}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {transactions.filter((t) => t.type === 'EXPENSE').length} {t('expense').toLowerCase()}
            </span>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="p-5 bg-gradient-to-br from-slate-900 to-[#121927] border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t('savingsRate')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-amber-300">
              %{savingsRate}
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-amber-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(savingsRate, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Cash Flow Ratio & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expense Balance bar */}
        <div className="lg:col-span-1 p-6 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-400" />
              <span>{t('incomeVsExpense')}</span>
            </h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-400 font-semibold">{t('income')}</span>
                <span className="text-slate-300 font-bold">{formatCurrency(totalIncome)}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{
                    width: totalIncome + totalExpense > 0
                      ? `${(totalIncome / (totalIncome + totalExpense)) * 100}%`
                      : '0%',
                  }}
                ></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-rose-400 font-semibold">{t('expense')}</span>
                <span className="text-slate-300 font-bold">{formatCurrency(totalExpense)}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-rose-500 h-2 rounded-full"
                  style={{
                    width: totalIncome + totalExpense > 0
                      ? `${(totalExpense / (totalIncome + totalExpense)) * 100}%`
                      : '0%',
                  }}
                ></div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>{t('netSavings')}:</span>
              <span className={`font-bold ${totalBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatCurrency(totalBalance)}
              </span>
            </div>
          </div>
        </div>

        {/* Top Expense Categories */}
        <div className="lg:col-span-2 p-6 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              {t('categoryBreakdown')}
            </h3>
            <button
              onClick={onNavigateToCategories}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>{t('categories')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {sortedExpenseCategories.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              {t('noTransactionsYet')}
            </div>
          ) : (
            <div className="space-y-3.5">
              {sortedExpenseCategories.map(([catId, data]) => {
                const percent = totalExpense > 0 ? Math.round((data.total / totalExpense) * 100) : 0;
                return (
                  <div key={catId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">
                        {getCategoryName(data.cat)}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-mono text-[11px]">{percent}%</span>
                        <span className="font-bold text-white">{formatCurrency(data.total)}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">{t('recentTransactions')}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Son kaydedilen gelir ve giderleriniz
            </p>
          </div>
          <button
            onClick={onNavigateToTransactions}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <span>{t('transactions')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <p className="text-sm text-slate-400">{t('noTransactionsYet')}</p>
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-emerald-400 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('addFirstTransaction')}</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {recentTransactions.map((tx) => {
              const cat = categoryMap.get(tx.categoryId);
              const isIncome = tx.type === 'INCOME';
              return (
                <div
                  key={tx.id}
                  onClick={() => onEditTransaction(tx)}
                  className="py-3.5 flex items-center justify-between hover:bg-slate-800/30 px-2 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                        isIncome
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      }`}
                    >
                      {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {tx.description}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="text-slate-300 font-medium">{getCategoryName(cat)}</span>
                        <span>·</span>
                        <span className="font-mono text-[11px] text-slate-500">{formatDate(tx.transactionDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-sm font-bold font-mono ${
                        isIncome ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                      {isIncome ? t('income') : t('expense')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
