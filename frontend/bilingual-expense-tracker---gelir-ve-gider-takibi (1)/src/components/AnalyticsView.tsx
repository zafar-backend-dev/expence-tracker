import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TransactionResponseDto, CategoryResponseDto } from '../types/api';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

interface AnalyticsViewProps {
  transactions: TransactionResponseDto[];
  categories: CategoryResponseDto[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ transactions, categories }) => {
  const { t, formatCurrency, getCategoryName } = useLanguage();

  const totalIncome = transactions
    .filter((tx) => tx.type === 'INCOME')
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const totalExpense = transactions
    .filter((tx) => tx.type === 'EXPENSE')
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((netSavings / totalIncome) * 100)) : 0;

  // Category map
  const categoryMap = new Map<string, CategoryResponseDto>();
  categories.forEach((cat) => categoryMap.set(cat.pkey, cat));

  // Expense by category
  const expenseBreakdown: Record<string, { total: number; count: number; cat?: CategoryResponseDto }> = {};
  transactions
    .filter((tx) => tx.type === 'EXPENSE')
    .forEach((tx) => {
      if (!expenseBreakdown[tx.categoryId]) {
        expenseBreakdown[tx.categoryId] = { total: 0, count: 0, cat: categoryMap.get(tx.categoryId) };
      }
      expenseBreakdown[tx.categoryId].total += Number(tx.amount || 0);
      expenseBreakdown[tx.categoryId].count += 1;
    });

  const sortedExpenses = Object.entries(expenseBreakdown).sort(([, a], [, b]) => b.total - a.total);

  // Income by category
  const incomeBreakdown: Record<string, { total: number; count: number; cat?: CategoryResponseDto }> = {};
  transactions
    .filter((tx) => tx.type === 'INCOME')
    .forEach((tx) => {
      if (!incomeBreakdown[tx.categoryId]) {
        incomeBreakdown[tx.categoryId] = { total: 0, count: 0, cat: categoryMap.get(tx.categoryId) };
      }
      incomeBreakdown[tx.categoryId].total += Number(tx.amount || 0);
      incomeBreakdown[tx.categoryId].count += 1;
    });

  const sortedIncomes = Object.entries(incomeBreakdown).sort(([, a], [, b]) => b.total - a.total);

  // Statistics
  const highestExpense = transactions
    .filter((tx) => tx.type === 'EXPENSE')
    .reduce((max, tx) => (Number(tx.amount) > max ? Number(tx.amount) : max), 0);

  const averageTransaction =
    transactions.length > 0
      ? (totalIncome + totalExpense) / transactions.length
      : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t('analytics')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Kapsamlı finansal raporlama, kategori dağılımı ve tasarruf verimliliği
        </p>
      </div>

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            {t('savingsRate')}
          </span>
          <div className="text-2xl font-extrabold text-amber-300 mt-2">%{savingsRate}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Net Tasarruf Oranı</span>
        </div>

        <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            {t('highestExpense')}
          </span>
          <div className="text-2xl font-extrabold text-rose-400 mt-2">{formatCurrency(highestExpense)}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">En büyük tekil harcama</span>
        </div>

        <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            {t('averageTransaction')}
          </span>
          <div className="text-2xl font-extrabold text-indigo-300 mt-2">{formatCurrency(averageTransaction)}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">İşlem başına ortalama</span>
        </div>

        <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Toplam İşlem / Total Tx
          </span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-2">{transactions.length}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Kayıtlı işlem hacmi</span>
        </div>
      </div>

      {/* Side-by-side: Expense Breakdown vs Income Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category */}
        <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-rose-400" />
              <span>Gider Kategori Dağılımı / Expenses by Category</span>
            </h3>
            <span className="text-xs font-bold text-rose-400">-{formatCurrency(totalExpense)}</span>
          </div>

          {sortedExpenses.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">{t('noTransactionsYet')}</div>
          ) : (
            <div className="space-y-4 pt-2">
              {sortedExpenses.map(([catId, item]) => {
                const percent = totalExpense > 0 ? Math.round((item.total / totalExpense) * 100) : 0;
                return (
                  <div key={catId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">
                        {getCategoryName(item.cat)}
                      </span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-slate-400 text-[11px] font-normal">({item.count} tx) %{percent}</span>
                        <span className="font-bold text-white">{formatCurrency(item.total)}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-rose-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Incomes by Category */}
        <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Gelir Kaynakları / Income Sources</span>
            </h3>
            <span className="text-xs font-bold text-emerald-400">+{formatCurrency(totalIncome)}</span>
          </div>

          {sortedIncomes.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">{t('noTransactionsYet')}</div>
          ) : (
            <div className="space-y-4 pt-2">
              {sortedIncomes.map(([catId, item]) => {
                const percent = totalIncome > 0 ? Math.round((item.total / totalIncome) * 100) : 0;
                return (
                  <div key={catId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">
                        {getCategoryName(item.cat)}
                      </span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-slate-400 text-[11px] font-normal">({item.count} tx) %{percent}</span>
                        <span className="font-bold text-white">{formatCurrency(item.total)}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
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
    </div>
  );
};
