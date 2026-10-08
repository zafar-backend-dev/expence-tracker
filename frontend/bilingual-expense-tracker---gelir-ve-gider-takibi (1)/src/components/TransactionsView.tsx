import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TransactionResponseDto, CategoryResponseDto, TransactionType } from '../types/api';
import {
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Edit2,
  Trash2,
  ChevronDown,
  Layers,
} from 'lucide-react';

interface TransactionsViewProps {
  transactions: TransactionResponseDto[];
  categories: CategoryResponseDto[];
  onOpenAddModal: () => void;
  onEditTransaction: (tx: TransactionResponseDto) => void;
  onDeleteTransaction: (tx: TransactionResponseDto) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  categories,
  onOpenAddModal,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const { t, language, currency, formatCurrency, formatDate, formatDateTime, getCategoryName } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | TransactionType>('ALL');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR'>('ALL');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');

  const categoryMap = useMemo(() => {
    const map = new Map<string, CategoryResponseDto>();
    categories.forEach((c) => map.set(c.pkey, c));
    return map;
  }, [categories]);

  // Filtered & Sorted Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type filter
      if (selectedType !== 'ALL' && tx.type !== selectedType) {
        return false;
      }

      // Category filter
      if (selectedCategoryId !== 'ALL' && tx.categoryId !== selectedCategoryId) {
        return false;
      }

      // Search query (description or amount)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesDesc = tx.description.toLowerCase().includes(query);
        const matchesAmount = String(tx.amount).includes(query);
        const cat = categoryMap.get(tx.categoryId);
        const catName = getCategoryName(cat).toLowerCase();
        const matchesCat = catName.includes(query);
        if (!matchesDesc && !matchesAmount && !matchesCat) return false;
      }

      // Date range filter
      if (dateRange !== 'ALL') {
        const txDate = new Date(tx.transactionDate);
        const now = new Date();

        if (dateRange === 'TODAY') {
          if (
            txDate.getDate() !== now.getDate() ||
            txDate.getMonth() !== now.getMonth() ||
            txDate.getFullYear() !== now.getFullYear()
          ) {
            return false;
          }
        } else if (dateRange === 'WEEK') {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(now.getDate() - 7);
          if (txDate < oneWeekAgo) return false;
        } else if (dateRange === 'MONTH') {
          if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) {
            return false;
          }
        } else if (dateRange === 'YEAR') {
          if (txDate.getFullYear() !== now.getFullYear()) {
            return false;
          }
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime();
      }
      if (sortBy === 'date_asc') {
        return new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime();
      }
      if (sortBy === 'amount_desc') {
        return Number(b.amount) - Number(a.amount);
      }
      if (sortBy === 'amount_asc') {
        return Number(a.amount) - Number(b.amount);
      }
      return 0;
    });
  }, [transactions, selectedType, selectedCategoryId, searchQuery, dateRange, sortBy, categoryMap, getCategoryName]);

  // Totals for filtered view
  const filteredIncome = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [filteredTransactions]);

  const filteredExpense = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [filteredTransactions]);

  // Export to CSV
  const handleExportCsv = () => {
    if (filteredTransactions.length === 0) return;

    const headers = [
      language === 'tr' ? 'Kimlik' : 'ID',
      language === 'tr' ? 'Tür' : 'Type',
      language === 'tr' ? 'Tutar' : 'Amount',
      language === 'tr' ? 'Para Birimi' : 'Currency',
      language === 'tr' ? 'Kategori' : 'Category',
      language === 'tr' ? 'Açıklama' : 'Description',
      language === 'tr' ? 'Tarih' : 'Date',
    ];

    const rows = filteredTransactions.map((tx) => {
      const cat = categoryMap.get(tx.categoryId);
      return [
        `"${tx.id}"`,
        `"${tx.type === 'INCOME' ? t('income') : t('expense')}"`,
        tx.amount,
        `"${currency}"`,
        `"${getCategoryName(cat)}"`,
        `"${tx.description.replace(/"/g, '""')}"`,
        `"${tx.transactionDate}"`,
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t('transactions')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {language === 'tr'
              ? 'Tüm finansal hareketlerinizi filtreleyin, arayın ve yönetin'
              : 'Filter, search, and manage all your financial activities'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            disabled={filteredTransactions.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors disabled:opacity-40"
          >
            <Download className="w-4 h-4" />
            <span>{t('exportCsv')}</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addTransaction')}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="p-4 sm:p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-slate-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchTransactions')}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0b0f17] border border-slate-800 focus:border-emerald-500 rounded-xl text-white placeholder-slate-500 text-xs transition-colors"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex bg-[#0b0f17] border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setSelectedType('ALL')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedType === 'ALL' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('allTypes')}
            </button>
            <button
              onClick={() => setSelectedType('INCOME')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedType === 'INCOME' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('income')}
            </button>
            <button
              onClick={() => setSelectedType('EXPENSE')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedType === 'EXPENSE' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('expense')}
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#0b0f17] border border-slate-800 focus:border-emerald-500 rounded-xl text-white text-xs cursor-pointer"
            >
              <option value="ALL">{t('allCategories')}</option>
              {categories.map((cat) => (
                <option key={cat.pkey} value={cat.pkey} className="bg-slate-900 text-white">
                  {getCategoryName(cat)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary filters: Date Presets and Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {t('filterByDate')}:
            </span>
            {(['ALL', 'TODAY', 'WEEK', 'MONTH', 'YEAR'] as const).map((range) => {
              const label =
                range === 'ALL'
                  ? t('allTime')
                  : range === 'TODAY'
                  ? t('today')
                  : range === 'WEEK'
                  ? t('thisWeek')
                  : range === 'MONTH'
                  ? t('thisMonth')
                  : t('thisYear');
              return (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    dateRange === range
                      ? 'bg-slate-800 text-emerald-400 font-semibold border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Sırala / Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1 bg-[#0b0f17] border border-slate-800 rounded-lg text-white text-xs cursor-pointer"
            >
              <option value="date_desc">Tarih (Yeniden Eskiye / Newest)</option>
              <option value="date_asc">Tarih (Eskiden Yeniye / Oldest)</option>
              <option value="amount_desc">Tutar (Yüksekten Düşüğe / Highest)</option>
              <option value="amount_asc">Tutar (Düşükten Yükseğe / Lowest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter summary status */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-400">
        <div>
          <span>{filteredTransactions.length} {t('itemsCount')}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-emerald-400 font-semibold">
            {t('income')}: +{formatCurrency(filteredIncome)}
          </span>
          <span className="text-rose-400 font-semibold">
            {t('expense')}: -{formatCurrency(filteredExpense)}
          </span>
        </div>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="p-12 bg-slate-900/40 border border-slate-800 rounded-2xl text-center space-y-3">
          <p className="text-sm text-slate-400">{t('noTransactionsYet')}</p>
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-emerald-400 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('addTransaction')}</span>
          </button>
        </div>
      ) : (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="divide-y divide-slate-800/80">
            {filteredTransactions.map((tx) => {
              const cat = categoryMap.get(tx.categoryId);
              const isIncome = tx.type === 'INCOME';

              return (
                <div
                  key={tx.id}
                  className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors group"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        isIncome
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      }`}
                    >
                      {isIncome ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {tx.description}
                      </h3>
                      {/* Zero-pill metadata line with typographic bullet separators */}
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span className="text-slate-300 font-medium">{getCategoryName(cat)}</span>
                        <span>·</span>
                        <span className="font-mono text-[11px] text-slate-500">{formatDateTime(tx.transactionDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    <div className="sm:text-right">
                      <div
                        className={`text-base font-extrabold font-mono ${
                          isIncome ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                        {isIncome ? t('income') : t('expense')}
                      </span>
                    </div>

                    {/* Edit & Delete Action Buttons */}
                    <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditTransaction(tx)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        title={t('editTransaction')}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTransaction(tx)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title={t('deleteTransaction')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
